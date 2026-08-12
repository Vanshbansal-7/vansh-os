const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1536, height: 960 },
    deviceScaleFactor: 2,
  });

  // Set founder authentication cookie
  await context.addCookies([
    {
      name: 'vansh_founder_auth',
      value: '2005',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'vos_founder_code',
      value: '2005',
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for animations/fonts to settle
  await page.waitForTimeout(2000);

  const outDir = path.join(__dirname, '..', 'public', 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath1 = path.join(outDir, '01_foundation_locked_ui.png');
  await page.screenshot({ path: outPath1 });
  console.log(`Saved screenshot 1 to ${outPath1}`);

  // Scroll center container to capture lower cards
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 450;
  });
  await page.waitForTimeout(500);

  const outPath2 = path.join(outDir, '02_foundation_lower_deck.png');
  await page.screenshot({ path: outPath2 });
  console.log(`Saved screenshot 2 to ${outPath2}`);

  // Copy to brain artifact directory
  const brainDir = 'C:\\Users\\bkban\\.gemini\\antigravity\\brain\\993015c6-5785-45ed-82d5-a4298a2f6ce2\\screenshots';
  if (!fs.existsSync(brainDir)) {
    fs.mkdirSync(brainDir, { recursive: true });
  }
  fs.copyFileSync(outPath1, path.join(brainDir, '01_foundation_locked_ui.png'));
  fs.copyFileSync(outPath2, path.join(brainDir, '02_foundation_lower_deck.png'));

  await browser.close();
}

capture().catch(console.error);
