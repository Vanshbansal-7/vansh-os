const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  const publicDir = path.join(__dirname, '..', 'public', 'screenshots');
  const artifactDir = 'C:\\Users\\bkban\\.gemini\\antigravity\\brain\\993015c6-5785-45ed-82d5-a4298a2f6ce2\\screenshots';

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  console.log('Launching browser...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  } catch (e) {
    console.log('Edge channel not found, trying chrome...');
    try {
      browser = await chromium.launch({ channel: 'chrome', headless: true });
    } catch (e2) {
      console.log('Chrome channel not found, trying default chromium...');
      browser = await chromium.launch({ headless: true });
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const baseUrl = 'https://vansh-os-delta.vercel.app';

  // 1. Capture Login Page (default Sign In tab)
  console.log('Capturing Login Page...');
  const page = await context.newPage();
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const loginPath = path.join(publicDir, '01_login_page.png');
  await page.screenshot({ path: loginPath, fullPage: true });
  fs.copyFileSync(loginPath, path.join(artifactDir, '01_login_page.png'));

  // 2. Capture Login Page (Code 2005 tab active)
  console.log('Capturing Login Page - Code 2005 Tab...');
  const code2005Btn = await page.getByRole('tab', { name: /2005/i });
  if (await code2005Btn.isVisible()) {
    await code2005Btn.click();
    await page.waitForTimeout(500);
  }
  const passcodeTabPath = path.join(publicDir, '02_login_passcode_tab.png');
  await page.screenshot({ path: passcodeTabPath, fullPage: true });
  fs.copyFileSync(passcodeTabPath, path.join(artifactDir, '02_login_passcode_tab.png'));

  // Set auth cookies for all authenticated engines
  await context.addCookies([
    {
      name: 'vos_founder_code',
      value: '2005',
      domain: 'vansh-os-delta.vercel.app',
      path: '/',
    },
    {
      name: 'vansh_founder_auth',
      value: '2005',
      domain: 'vansh-os-delta.vercel.app',
      path: '/',
    }
  ]);

  const routes = [
    { name: '03_dashboard_mission_control', url: `${baseUrl}/` },
    { name: '04_career_engine', url: `${baseUrl}/career` },
    { name: '05_learning_engine', url: `${baseUrl}/learning` },
    { name: '06_life_engine', url: `${baseUrl}/life` },
    { name: '07_system_engine', url: `${baseUrl}/system` },
  ];

  for (const route of routes) {
    console.log(`Capturing ${route.name} (${route.url})...`);
    await page.goto(route.url, { waitUntil: 'networkidle' });
    // Wait for animations and data to settle
    await page.waitForTimeout(2500);
    const dest = path.join(publicDir, `${route.name}.png`);
    await page.screenshot({ path: dest, fullPage: true });
    fs.copyFileSync(dest, path.join(artifactDir, `${route.name}.png`));
    console.log(`Saved ${route.name}.png`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
