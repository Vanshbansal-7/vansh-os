const { chromium } = require('playwright');

async function captureAllCGLTabs() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1536, height: 900 },
  });

  // Inject the founder auth cookie so middleware grants access
  await context.addCookies([
    {
      name: 'vos_founder_code',
      value: '2005',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'vansh_founder_auth',
      value: '2005',
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  const BASE = 'http://localhost:3000';

  // Navigate to CGL module (Tracker is default tab)
  await page.goto(`${BASE}/modules/cgl`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot: Tracker Tab (default)
  await page.screenshot({ path: 'public/screenshots/cgl_tracker_tab.png', fullPage: false });
  console.log('✅ Saved: cgl_tracker_tab.png');

  // Click Overview Tab
  await page.click('button:has-text("Overview")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'public/screenshots/cgl_overview_tab.png', fullPage: false });
  console.log('✅ Saved: cgl_overview_tab.png');

  // Click Resources Tab
  await page.click('button:has-text("Resources")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'public/screenshots/cgl_resources_tab.png', fullPage: false });
  console.log('✅ Saved: cgl_resources_tab.png');

  // Click Notes Tab
  await page.click('button:has-text("Notes")');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'public/screenshots/cgl_notes_tab.png', fullPage: false });
  console.log('✅ Saved: cgl_notes_tab.png');

  await browser.close();
  console.log('🎉 All CGL tab screenshots captured!');
}

captureAllCGLTabs().catch(console.error);
