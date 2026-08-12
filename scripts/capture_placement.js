const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function capturePlacement() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Inject founder auth cookie
  await ctx.addCookies([{
    name: 'vos_founder_code',
    value: '2005',
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
  }]);

  const page = await ctx.newPage();

  // Capture Tracker tab
  await page.goto(BASE_URL + '/modules/placement', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'placement_tracker_tab.png'), fullPage: false });
  console.log('✅ Saved: placement_tracker_tab.png');

  // Switch to Resources tab and capture
  await page.click('button:has-text("Resources & Links")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'placement_resources_tab.png'), fullPage: false });
  console.log('✅ Saved: placement_resources_tab.png');

  await browser.close();
}

capturePlacement().catch(console.error);
