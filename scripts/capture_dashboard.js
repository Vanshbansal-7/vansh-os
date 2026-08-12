const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'public', 'screenshots');

async function captureDashboard() {
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

  // Capture dashboard
  await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  const file = path.join(SCREENSHOTS_DIR, 'phase4_dashboard.png');
  await page.screenshot({ path: file, fullPage: false });
  console.log('✅ Saved: phase4_dashboard.png');

  await browser.close();
}

captureDashboard().catch(console.error);
