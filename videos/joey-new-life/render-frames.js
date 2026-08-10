// Renders poster.html frame-by-frame (deterministic seek) to JPEG frames.
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const FPS = 30, DUR = 15, W = 1080, H = 1350;
const OUT = path.join(__dirname, 'frames');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--force-color-profile=srgb', '--disable-lcd-text'],
  });
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + path.join(__dirname, 'poster.html'));
  await page.waitForTimeout(500);

  const total = FPS * DUR;
  for (let i = 0; i < total; i++) {
    const t = i / FPS;
    await page.evaluate(tt => window.seek(tt), t);
    await page.screenshot({
      path: path.join(OUT, `f${String(i).padStart(4, '0')}.jpg`),
      type: 'jpeg', quality: 92,
    });
    if (i % 60 === 0) console.log(`frame ${i}/${total}`);
  }
  await browser.close();
  console.log('done: ' + total + ' frames');
})().catch(e => { console.error(e); process.exit(1); });
