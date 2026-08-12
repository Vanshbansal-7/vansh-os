const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function extractAssets() {
  const assetsDir = path.join(__dirname, '..', 'public', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const srcPath = 'C:\\Users\\bkban\\.gemini\\antigravity\\brain\\993015c6-5785-45ed-82d5-a4298a2f6ce2\\.user_uploaded\\media__1785833266424.jpg';
  const destMaster = path.join(assetsDir, 'reference_master.jpg');
  fs.copyFileSync(srcPath, destMaster);

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const page = await browser.newPage();

  // Read master image as base64 data url
  const imgData = fs.readFileSync(srcPath).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${imgData}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:#000;">
        <img id="ref" src="${dataUrl}" style="display:none;" />
        <canvas id="c"></canvas>
      </body>
    </html>
  `;
  await page.setContent(html);

  // Crop function on page
  async function cropRegion(filename, sxPct, syPct, swPct, shPct) {
    const buffer = await page.evaluate(async ({ sxPct, syPct, swPct, shPct }) => {
      const img = document.getElementById('ref');
      if (!img.complete) {
        await new Promise(r => img.onload = r);
      }
      const c = document.getElementById('c');
      const ctx = c.getContext('2d');

      const W = img.naturalWidth;
      const H = img.naturalHeight;

      const sx = Math.floor(W * sxPct);
      const sy = Math.floor(H * syPct);
      const sw = Math.floor(W * swPct);
      const sh = Math.floor(H * shPct);

      c.width = sw;
      c.height = sh;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      return c.toDataURL('image/png').split(',')[1];
    }, { sxPct, syPct, swPct, shPct });

    fs.writeFileSync(path.join(assetsDir, filename), Buffer.from(buffer, 'base64'));
    console.log(`Cropped: ${filename}`);
  }

  // Get natural dimensions
  const dims = await page.evaluate(() => {
    const img = document.getElementById('ref');
    return { w: img.naturalWidth, h: img.naturalHeight };
  });
  console.log('Image dimensions:', dims);

  // Gita Artwork in Left Sidebar: sx ~ 0.007 to 0.125, sy ~ 0.528 to 0.825
  await cropRegion('gita_artwork.png', 0.006, 0.528, 0.124, 0.297);

  // Mountain landscape in Hero card: sx ~ 0.48 to 0.77, sy ~ 0.126 to 0.29
  await cropRegion('mountain_landscape.png', 0.48, 0.126, 0.295, 0.162);

  // Founder avatar (bottom left): sx ~ 0.0125, sy ~ 0.880, sw ~ 0.021, sh ~ 0.037
  await cropRegion('founder_avatar.png', 0.0125, 0.880, 0.021, 0.037);

  await browser.close();
  console.log('All crops saved to public/assets/');
}

extractAssets().catch(console.error);
