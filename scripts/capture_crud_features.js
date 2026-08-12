const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureCRUD() {
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

  // 1. Capture Placement Tracker Clean Slate Empty State
  await page.goto(BASE_URL + '/modules/placement', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'placement_empty_slate_tracker.png'), fullPage: false });
  console.log('✅ Saved: placement_empty_slate_tracker.png');

  // 2. Open Add Subject Modal
  await page.click('button:has-text("+ Create Subject")');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'add_subject_modal.png'), fullPage: false });
  console.log('✅ Saved: add_subject_modal.png');

  await browser.close();
}

captureCRUD().catch(console.error);
