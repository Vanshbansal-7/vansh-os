const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureYouTubeTracker() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  await ctx.addCookies([{
    name: 'vos_founder_code',
    value: '2005',
    domain: 'localhost',
    path: '/',
    httpOnly: false,
    secure: false,
  }]);

  const page = await ctx.newPage();

  await page.goto(BASE_URL + '/modules/youtube', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Switch to Tracker Tab
  await page.click('button:has-text("Tracker")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'youtube_tracker_4checks_tab.png'), fullPage: false });
  console.log('✅ Saved: youtube_tracker_4checks_tab.png');

  await browser.close();
}

captureYouTubeTracker().catch(console.error);
