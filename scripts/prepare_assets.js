const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  
  const logoPath = path.resolve(__dirname, '../public/assets/vos_logo.png');
  const base64 = fs.readFileSync(logoPath).toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background:transparent;">
        <canvas id="c" width="400" height="400"></canvas>
        <script>
          const img = new Image();
          img.onload = () => {
            const canvas = document.getElementById('c');
            const ctx = canvas.getContext('2d');
            
            // Draw image centered on V
            // Image is approx 960x640, the V is in center
            ctx.drawImage(img, -280, -120, 960, 640);
            
            const imgData = ctx.getImageData(0, 0, 400, 400);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];
              // If near white, make transparent
              if (r > 240 && g > 240 && b > 240) {
                data[i+3] = 0;
              } else if (r > 220 && g > 220 && b > 220) {
                // smooth alpha transition
                const factor = (255 - Math.max(r, g, b)) / 35;
                data[i+3] = Math.min(data[i+3], Math.floor(255 * factor));
              }
            }
            ctx.putImageData(imgData, 0, 0);
            window.__done = true;
          };
          img.src = "${dataUrl}";
        </script>
      </body>
    </html>
  `);

  await page.waitForFunction(() => window.__done === true);
  const canvasElement = await page.$('#c');
  const buffer = await canvasElement.screenshot({ omitBackground: true });
  
  fs.writeFileSync(path.resolve(__dirname, '../public/assets/v_logo_transparent.png'), buffer);
  console.log('Saved v_logo_transparent.png successfully!');
  await browser.close();
}

processLogo().catch(console.error);
