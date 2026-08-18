#!/usr/bin/env node
/**
 * export-graphic.mjs
 * Renders a standalone HTML graphic (a design in designs/, a slide, a diagram)
 * to PNG / JPEG / PDF at fixed widths.
 *
 * Usage:
 *   node scripts/export-graphic.mjs designs/key-features-summary/index.html
 *   node scripts/export-graphic.mjs design.html --width 1600 --scale 2
 *   node scripts/export-graphic.mjs designs/*\/index.html --formats png,jpeg,pdf --out ./exports
 *   node scripts/export-graphic.mjs design.html --width 1920,1080,800   # multiple sizes
 *
 * Flags:
 *   --width    <n[,n]>  CSS pixel width(s). Default 1600.
 *   --scale    <n>      Device pixel ratio. Default 2 (so 1600 -> 3200px PNG).
 *   --formats  <list>   png | jpeg | pdf. Default png.
 *   --quality  <n>      JPEG quality 1-100. Default 92.
 *   --settle   <ms>     Wait before capture so load animations finish. Default 2600.
 *   --selector <css>    Element to crop to. Default: first match of the auto list below.
 *   --scheme   <name>   prefers-color-scheme: light | dark | no-preference. Default no-preference.
 *   --no-freeze         Leave animations running mid-capture.
 *   --out      <dir>    Output directory. Default ./exports.
 *
 * Requires Playwright, which is not a dependency of this repo:
 *   npm i -D playwright && npx playwright install chromium
 *
 * Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to use a Chromium already on the machine
 * (CI images and sandboxes often ship one that Playwright's own download would duplicate).
 */

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';

/* ---------- argument parsing ---------- */
const FLAGS = ['width', 'scale', 'formats', 'quality', 'settle', 'selector', 'scheme', 'out'];
const FORMATS = ['png', 'jpeg', 'pdf'];
const SCHEMES = ['light', 'dark', 'no-preference'];

/* Tried in order when --selector is omitted. `.canvas` and `.slide` are the wrappers
   the designs in designs/ use; the data attributes cover importer-annotated files. */
const AUTO_SELECTORS = ['.canvas', '.slide', '[data-canvas-width]', '[data-graphic-root]', 'body'];

const USAGE = `Usage: node scripts/export-graphic.mjs <file.html> [more.html] [flags]

  --width    <n[,n]>  CSS pixel width(s). Default 1600.
  --scale    <n>      Device pixel ratio. Default 2 (so 1600 -> 3200px PNG).
  --formats  <list>   png | jpeg | pdf. Default png.
  --quality  <n>      JPEG quality 1-100. Default 92.
  --settle   <ms>     Wait before capture so load animations finish. Default 2600.
  --selector <css>    Element to crop to. Default: first match of
                      ${AUTO_SELECTORS.join(', ')}.
  --scheme   <name>   prefers-color-scheme: ${SCHEMES.join(' | ')}. Default no-preference.
  --no-freeze         Leave animations running mid-capture.
  --out      <dir>    Output directory. Default ./exports.`;

const argv = process.argv.slice(2);
const inputs = [];
const opt = {
    width: '1600',
    scale: '2',
    formats: 'png',
    quality: '92',
    settle: '2600',
    selector: '',
    scheme: 'no-preference',
    out: './exports',
    freeze: true,
};

function fail(message) {
    console.error(`export-graphic: ${message}`);
    process.exit(1);
}

for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--no-freeze') { opt.freeze = false; continue; }
    if (arg === '--help' || arg === '-h') { console.log(USAGE); process.exit(0); }
    if (arg.startsWith('--')) {
        const name = arg.slice(2);
        if (!FLAGS.includes(name)) fail(`unknown flag --${name}. Known flags: ${FLAGS.map(f => `--${f}`).join(', ')}, --no-freeze`);
        const value = argv[++i];
        if (value === undefined) fail(`--${name} needs a value`);
        opt[name] = value;
        continue;
    }
    inputs.push(arg);
}

if (inputs.length === 0) {
    fail('no input files. Usage: node scripts/export-graphic.mjs <file.html> [flags]');
}

function positiveNumbers(raw, label) {
    const values = String(raw).split(',').map(n => Number(n.trim())).filter(n => !Number.isNaN(n));
    if (values.length === 0 || values.some(n => n <= 0)) fail(`--${label} must be a positive number${label === 'width' ? ' (or comma-separated list)' : ''}, got "${raw}"`);
    return values;
}

const widths = positiveNumbers(opt.width, 'width').map(Math.round);
const [scale] = positiveNumbers(opt.scale, 'scale');
const [quality] = positiveNumbers(opt.quality, 'quality');
const settle = Number(opt.settle);
const formats = String(opt.formats).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
const outDir = path.resolve(opt.out);

if (!Number.isFinite(settle) || settle < 0) fail(`--settle must be >= 0, got "${opt.settle}"`);
if (quality > 100) fail('--quality must be between 1 and 100');
if (formats.length === 0) fail('--formats needs at least one of: ' + FORMATS.join(', '));
const unknownFormat = formats.find(f => !FORMATS.includes(f));
if (unknownFormat) fail(`unknown format "${unknownFormat}". Supported: ${FORMATS.join(', ')}`);
if (!SCHEMES.includes(opt.scheme)) fail(`unknown --scheme "${opt.scheme}". Supported: ${SCHEMES.join(', ')}`);

/* Injected after the settle delay. Pauses every animation so flowing dashes and
   pulsing rings are captured at a consistent frame instead of a random one. */
const FREEZE_CSS = `*,*::before,*::after{
  animation-play-state:paused !important;
  transition:none !important;
}
/* A marquee frozen mid-scroll crops its first word. Snap it back to the start. */
.ticker-track,[data-marquee]{
  animation:none !important;
  transform:none !important;
}`;

/* ---------- render ---------- */
let chromium;
try {
    ({ chromium } = await import('playwright'));
} catch {
    fail('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
}

await fs.mkdir(outDir, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const results = [];
let missing = 0;

try {
    for (const input of inputs) {
        const abs = path.resolve(input);
        try {
            await fs.access(abs);
        } catch {
            console.error(`  skip  ${input} — file not found`);
            missing++;
            continue;
        }
        const base = path.basename(abs, path.extname(abs));

        for (const width of widths) {
            const context = await browser.newContext({
                viewport: { width, height: 1200 },
                deviceScaleFactor: scale,
                colorScheme: opt.scheme,
                // Keep the load choreography alive; --no-freeze then captures it mid-flight.
                reducedMotion: 'no-preference',
            });
            const page = await context.newPage();

            try {
                await page.goto(pathToFileURL(abs).href, { waitUntil: 'networkidle' });

                // Designs centre themselves with body padding; strip it so the graphic
                // edge is the crop edge.
                await page.addStyleTag({ content: 'body{padding:0 !important}' });

                // Let fonts resolve before measuring, or the captured height will be wrong.
                // eslint-disable-next-line no-undef -- the callback runs in the browser
                await page.evaluate(() => document.fonts?.ready.then(() => true));
                await page.waitForTimeout(settle);

                if (opt.freeze) await page.addStyleTag({ content: FREEZE_CSS });

                const candidates = opt.selector ? [opt.selector] : AUTO_SELECTORS;
                let target = null;
                for (const selector of candidates) {
                    target = await page.$(selector);
                    if (target) break;
                }
                if (!target) {
                    console.error(`  skip  ${input} — no element matched ${candidates.join(', ')}`);
                    missing++;
                    continue;
                }

                for (const fmt of formats) {
                    const suffix = widths.length > 1 ? `-${width}w` : '';
                    if (fmt === 'pdf') {
                        const box = await target.boundingBox();
                        const file = path.join(outDir, `${base}${suffix}.pdf`);
                        await page.pdf({
                            path: file,
                            width: `${Math.ceil(box.width)}px`,
                            height: `${Math.ceil(box.height)}px`,
                            printBackground: true,
                            pageRanges: '1',
                            margin: { top: '0', right: '0', bottom: '0', left: '0' },
                        });
                        results.push(file);
                    } else {
                        const ext = fmt === 'jpeg' ? 'jpg' : 'png';
                        const file = path.join(outDir, `${base}${suffix}.${ext}`);
                        await target.screenshot({
                            path: file,
                            type: fmt,
                            ...(fmt === 'jpeg' ? { quality } : {}),
                            scale: 'device',
                        });
                        results.push(file);
                    }
                }
            } finally {
                await context.close();
            }
        }
    }
} finally {
    await browser.close();
}

/* ---------- report ---------- */
if (results.length === 0) {
    console.error('Nothing rendered.');
    process.exit(1);
}
console.log(`Rendered ${results.length} file(s) at ${scale}x into ${outDir}`);
for (const file of results) {
    const { size } = await fs.stat(file);
    console.log(`  ${path.basename(file)}  ${(size / 1024).toFixed(0)} KB`);
}
if (missing > 0) process.exit(1);
