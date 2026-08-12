const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureAIFeatures() {
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

  // 1. Capture Dashboard with Fixed Floating Omnibar at bottom center
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'fixed_omnibar_alignment.png'), fullPage: false });
  console.log('✅ Saved: fixed_omnibar_alignment.png');

  // 2. Open Vansh AI Modal (⌘ J) and capture overlay
  await page.keyboard.press('Control+j');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'vansh_ai_intelligence_modal.png'), fullPage: false });
  console.log('✅ Saved: vansh_ai_intelligence_modal.png');

  await browser.close();
}

captureAIFeatures().catch(console.error);
