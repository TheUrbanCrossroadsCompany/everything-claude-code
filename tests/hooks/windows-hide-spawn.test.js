/**
 * Regression guard: every child_process call reachable from a hook must pass
 * `windowsHide: true`.
 *
 * Why: on Windows, plugin-hook-bootstrap.js launches hook wrappers with
 * windowsHide (CREATE_NO_WINDOW), so those wrappers have no console to share.
 * Any further child they spawn WITHOUT windowsHide gets a brand-new, visible,
 * empty console window titled with the executable path (for example
 * "C:\Program Files\nodejs\node.exe"). Hooks fire on nearly every tool call,
 * so a single missing flag produces a stream of pop-up windows.
 *
 * Run with: node tests/hooks/windows-hide-spawn.test.js
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');

const SPAWN_FUNCS = ['spawnSync', 'spawn', 'execFileSync', 'execFile', 'execSync', 'exec', 'fork'];

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (err) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full, out);
    } else if (/\.(c|m)?js$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** Files that hooks execute or load: hook scripts, shared libs, skill hooks. */
function collectHookPathFiles() {
  const files = [];
  walk(path.join(repoRoot, 'scripts', 'hooks'), files);
  walk(path.join(repoRoot, 'scripts', 'lib'), files);
  const skillsDir = path.join(repoRoot, 'skills');
  for (const skill of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (skill.isDirectory()) walk(path.join(skillsDir, skill.name, 'hooks'), files);
  }
  return files;
}

/**
 * Return the local names bound to child_process spawn functions, plus any
 * namespace identifier (e.g. `const cp = require('child_process')`).
 */
function childProcessBindings(src) {
  const direct = new Set();
  const namespaces = new Set();
  const destructure = /(?:const|let|var)\s*\{([^}]+)\}\s*=\s*require\(\s*['"](?:node:)?child_process['"]\s*\)/g;
  const esmImport = /import\s*\{([^}]+)\}\s*from\s*['"](?:node:)?child_process['"]/g;
  for (const re of [destructure, esmImport]) {
    let m;
    while ((m = re.exec(src))) {
      for (const part of m[1].split(',')) {
        const [imported, local] = part.split(/\s*(?::|\bas\b)\s*/).map(s => s.trim());
        if (SPAWN_FUNCS.includes(imported)) direct.add(local || imported);
      }
    }
  }
  const nsRequire = /(?:const|let|var)\s+(\w+)\s*=\s*require\(\s*['"](?:node:)?child_process['"]\s*\)/g;
  const nsImport = /import\s+\*\s+as\s+(\w+)\s+from\s*['"](?:node:)?child_process['"]/g;
  for (const re of [nsRequire, nsImport]) {
    let m;
    while ((m = re.exec(src))) namespaces.add(m[1]);
  }
  return { direct, namespaces };
}

/** Blank out comment text (keeping offsets/line numbers) so commented code is ignored. */
function maskComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, block => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (line, lead) => lead + ' '.repeat(line.length - lead.length));
}

function extractCall(src, openParenIndex) {
  let depth = 0;
  for (let i = openParenIndex; i < src.length && i < openParenIndex + 4000; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')') {
      depth--;
      if (depth === 0) return src.slice(openParenIndex, i + 1);
    }
  }
  return src.slice(openParenIndex, openParenIndex + 4000);
}

/** An options object passed by name (or spread) counts if its definition sets windowsHide. */
function referencedOptionsHideWindows(callText, src) {
  const names = new Set();
  let m;
  const spread = /\.\.\.(\w+)/g;
  while ((m = spread.exec(callText))) names.add(m[1]);
  const trailing = /,\s*(\w+)\s*\)$/.exec(callText);
  if (trailing) names.add(trailing[1]);
  for (const name of names) {
    const def = new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*\\{[^;]*windowsHide\\s*:\\s*true`);
    if (def.test(src)) return true;
  }
  return false;
}

function findUnhiddenSpawns(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!/child_process/.test(raw)) return [];
  const { direct, namespaces } = childProcessBindings(raw);
  if (direct.size === 0 && namespaces.size === 0) return [];

  const src = maskComments(raw);
  const offenders = [];
  const patterns = [];
  if (direct.size) patterns.push(`(?<![\\w.$])(?:${[...direct].join('|')})\\s*\\(`);
  if (namespaces.size) patterns.push(`\\b(?:${[...namespaces].join('|')})\\.(?:${SPAWN_FUNCS.join('|')})\\s*\\(`);
  const callRe = new RegExp(patterns.join('|'), 'g');

  let m;
  while ((m = callRe.exec(src))) {
    const before = src.slice(Math.max(0, m.index - 9), m.index);
    if (/function\s*$/.test(before)) continue; // a local function declaration, not a call
    const callText = extractCall(src, m.index + m[0].length - 1);
    if (/windowsHide\s*:\s*true/.test(callText)) continue;
    if (referencedOptionsHideWindows(callText, src)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const callee = m[0].replace(/\s*\($/, '');
    offenders.push(`${path.relative(repoRoot, file)}:${line}  ${callee}${callText.split('\n')[0].trim().slice(0, 100)}`);
  }
  return offenders;
}

function runTests() {
  console.log('\n=== Testing windowsHide on hook-path child processes ===\n');
  let passed = 0;
  let failed = 0;

  const files = collectHookPathFiles();

  if (test('scans the hook wrappers that launch node.exe', () => {
    const rel = files.map(f => path.relative(repoRoot, f).split(path.sep).join('/'));
    for (const expected of [
      'scripts/hooks/run-with-flags.js',
      'scripts/hooks/session-start-bootstrap.js',
      'scripts/hooks/plugin-hook-bootstrap.js',
      'scripts/hooks/mcp-health-check.js',
    ]) {
      assert.ok(rel.includes(expected), `expected ${expected} to be scanned`);
    }
  })) passed++; else failed++;

  if (test('detector flags a spawn without windowsHide and accepts one with it', () => {
    const tmpDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'windows-hide-test-'));
    try {
      const bad = path.join(tmpDir, 'bad.js');
      fs.writeFileSync(bad, [
        "const { spawnSync } = require('child_process');",
        "spawnSync(process.execPath, ['x.js'], { encoding: 'utf8' });",
        "// spawnSync('commented-out', [], {});",
      ].join('\n'));
      assert.strictEqual(findUnhiddenSpawns(bad).length, 1, 'un-hidden spawn should be flagged once');

      const good = path.join(tmpDir, 'good.js');
      fs.writeFileSync(good, [
        "const cp = require('child_process');",
        "const opts = { encoding: 'utf8', windowsHide: true };",
        "cp.spawnSync('git', ['status'], { windowsHide: true });",
        "cp.execFileSync('git', ['status'], opts);",
        "require('child_process').spawnSync; // reference only",
      ].join('\n'));
      assert.deepStrictEqual(findUnhiddenSpawns(good), []);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  })) passed++; else failed++;

  if (test('every child_process call in hook-path code sets windowsHide: true', () => {
    const offenders = files.flatMap(findUnhiddenSpawns);
    assert.deepStrictEqual(
      offenders,
      [],
      `Child processes without windowsHide open visible console windows on Windows:\n    ${offenders.join('\n    ')}`
    );
  })) passed++; else failed++;

  console.log(`\nResults: Passed: ${passed}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
