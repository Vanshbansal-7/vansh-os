const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureExams() {
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

  // 1. Capture Exams Launcher Dashboard
  await page.goto(BASE_URL + '/modules/exams', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'exams_launcher_dashboard.png'), fullPage: false });
  console.log('✅ Saved: exams_launcher_dashboard.png');

  // 2. Capture AFCAT Workspace Overview Tab
  await page.goto(BASE_URL + '/modules/exams/afcat', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'afcat_overview_tab.png'), fullPage: false });
  console.log('✅ Saved: afcat_overview_tab.png');

  // 3. Switch to Tracker Tab and capture
  await page.click('button:has-text("Tracker")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'afcat_tracker_tab.png'), fullPage: false });
  console.log('✅ Saved: afcat_tracker_tab.png');

  await browser.close();
}

captureExams().catch(console.error);
