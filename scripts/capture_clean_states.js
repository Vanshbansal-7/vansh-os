const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureCleanStates() {
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

  // 1. Capture YouTube Module Clean State Banner
  await page.goto(BASE_URL + '/modules/youtube', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'youtube_clean_profile_state.png'), fullPage: false });
  console.log('✅ Saved: youtube_clean_profile_state.png');

  // 2. Capture Exams Command Center Launcher Clean State
  await page.goto(BASE_URL + '/modules/exams', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'exams_clean_launcher_state.png'), fullPage: false });
  console.log('✅ Saved: exams_clean_launcher_state.png');

  await browser.close();
}

captureCleanStates().catch(console.error);
