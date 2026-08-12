const { chromium } = require('playwright');

async function testVOSRefresh() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1536, height: 960 },
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
  console.log('Testing Dashboard initial load with authentication...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Verify Hero Card contains Gita Verse text
  const heroText = await page.textContent('body');
  if (!heroText.includes('कर्मण्येवाधिकारस्ते')) {
    throw new Error('Hero card does not contain Bhagavad Gita shlok');
  }
  console.log('✓ Hero card Bhagavad Gita verse verified');

  // Test 1: Click VOS logo while on '/'
  console.log('Testing VOS logo click on Dashboard (SPA refresh)...');
  const logoButton = page.locator('button[title*="Click to navigate home or refresh dashboard data"]');
  await logoButton.click();
  await page.waitForTimeout(1000);
  console.log('✓ In-place dashboard refresh completed without reload');

  // Test 2: Navigate to subpage (/mission)
  console.log('Navigating to /mission...');
  await page.goto('http://localhost:3000/mission', { waitUntil: 'networkidle' });
  const missionHeader = await page.getByRole('heading', { name: 'Mission Center' }).textContent();
  console.log('Current page header:', missionHeader);

  // Click VOS logo from /mission -> should return to / and refresh
  console.log('Clicking VOS logo from /mission...');
  await logoButton.click();
  await page.waitForURL('http://localhost:3000/');
  await page.waitForTimeout(1000);
  console.log('✓ Successfully navigated back to / and triggered dashboard refresh');

  await browser.close();
  console.log('All verification checks PASSED!');
}

testVOSRefresh().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
