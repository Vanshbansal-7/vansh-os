const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureAllOverviews() {
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

  // 1. Vijaypath Dashboard
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'vijaypath_dashboard_fixed.png'), fullPage: false });
  console.log('✅ Saved: vijaypath_dashboard_fixed.png');

  // 2. YouTube Overview
  await page.goto(BASE_URL + '/modules/youtube', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'youtube_overview_fixed.png'), fullPage: false });
  console.log('✅ Saved: youtube_overview_fixed.png');

  // 3. Exams AFCAT Overview
  await page.goto(BASE_URL + '/modules/exams/afcat', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'afcat_overview_fixed.png'), fullPage: false });
  console.log('✅ Saved: afcat_overview_fixed.png');

  await browser.close();
}

captureAllOverviews().catch(console.error);
