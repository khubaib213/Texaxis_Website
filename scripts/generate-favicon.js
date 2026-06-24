const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'images', 'texaxis.png');
const OUT = path.join(ROOT, 'images');

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error('Logo not found:', LOGO);
    process.exit(1);
  }

  await sharp(LOGO)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(OUT, 'favicon-32x32.png'));

  await sharp(LOGO)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(path.join(OUT, 'apple-touch-icon.png'));

  await sharp(LOGO)
    .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile(path.join(OUT, 'favicon.ico'));

  console.log('Generated favicon-32x32.png, apple-touch-icon.png, favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
