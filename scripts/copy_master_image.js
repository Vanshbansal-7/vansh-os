const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const srcPath = 'C:\\Users\\bkban\\.gemini\\antigravity\\brain\\993015c6-5785-45ed-82d5-a4298a2f6ce2\\.user_uploaded\\media__1785833266424.jpg';
const destMaster = path.join(assetsDir, 'reference_master.jpg');
fs.copyFileSync(srcPath, destMaster);
console.log('Copied reference_master.jpg to public/assets');
