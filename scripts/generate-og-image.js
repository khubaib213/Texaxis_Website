const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'images', 'texaxis.png');
const OUT_JPG = path.join(ROOT, 'images', 'og-image.jpg');
const OUT_PNG = path.join(ROOT, 'images', 'og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error('Logo not found:', LOGO);
    process.exit(1);
  }

  const logoBuf = await sharp(LOGO)
    .resize({ width: 420, height: 140, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const logoBox = Buffer.from(`
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="520" height="180" rx="16" fill="#ffffff"/>
    </svg>
  `);

  const textSvg = Buffer.from(`
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#003d8f"/>
          <stop offset="55%" style="stop-color:#0052cc"/>
          <stop offset="100%" style="stop-color:#0c1f3d"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="1080" cy="80" r="220" fill="#007CDB" fill-opacity="0.18"/>
      <circle cx="80" cy="560" r="180" fill="#38bdf8" fill-opacity="0.12"/>
      <text x="600" y="400" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="700" fill="#ffffff">TEXAXIS</text>
      <text x="600" y="455" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="500" fill="#e8f4fd">Textile Processing Chemicals &amp; Enzymes</text>
      <text x="600" y="510" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)">Pakistan · Lahore · Faisalabad · Karachi</text>
    </svg>
  `);

  const base = await sharp(textSvg)
    .composite([
      { input: logoBox, top: 150, left: 340 },
      { input: logoBuf, top: 170, left: 390 },
    ])
    .png()
    .toBuffer();

  await sharp(base).jpeg({ quality: 88, mozjpeg: true }).toFile(OUT_JPG);
  await sharp(base).png().toFile(OUT_PNG);

  console.log('Generated images/og-image.jpg and images/og-image.png (1200×630)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
