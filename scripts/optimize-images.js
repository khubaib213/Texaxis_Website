/**
 * Compresses site images and generates WebP variants.
 * Originals are backed up to images/_originals/ before overwrite.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const IMAGES = path.join(ROOT, 'images');
const BACKUP = path.join(IMAGES, '_originals');

const JOBS = [
  { file: 'image1.jpg', maxWidth: 1920, jpegQuality: 82 },
  { file: 'image2.jpg', maxWidth: 1920, jpegQuality: 82 },
  { file: 'image3.jpg', maxWidth: 1920, jpegQuality: 82 },
  { file: 'aboutus.jpg', maxWidth: 1200, jpegQuality: 80 },
  { file: 'texaxis.png', maxWidth: 400, pngQuality: 90 },
  { file: 'alfakimya.png', maxWidth: 320, pngQuality: 90 },
  { file: 'lonct.png', maxWidth: 320, pngQuality: 90 },
  { file: 'ansen.png', maxWidth: 320, pngQuality: 90 },
  { file: 'texpert.png', maxWidth: 320, pngQuality: 90 },
  { file: 'pattern.png', maxWidth: 480, pngQuality: 80, allowPalette: false },
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function replaceFile(source, target) {
  fs.copyFileSync(source, target);
  fs.unlinkSync(source);
}

function backupFile(filePath) {
  const name = path.basename(filePath);
  const dest = path.join(BACKUP, name);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(filePath, dest);
  }
  return dest;
}

function restoreIfNeeded(filePath, backupPath, before) {
  const after = fs.statSync(filePath).size;
  if (after >= before) {
    fs.copyFileSync(backupPath, filePath);
    return before;
  }
  return after;
}

async function writeWebp(inputPath, webpPath, maxWidth) {
  let pipeline = sharp(inputPath).rotate();
  const meta = await sharp(inputPath).metadata();
  if (meta.width && maxWidth && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }
  await pipeline.webp({ quality: 82 }).toFile(webpPath);
  return fs.statSync(webpPath).size;
}

async function optimizeJob(job) {
  const input = path.join(IMAGES, job.file);
  if (!fs.existsSync(input)) {
    console.log(`  skip (missing): ${job.file}`);
    return null;
  }

  const backupPath = backupFile(input);
  const before = fs.statSync(backupPath).size;
  const ext = path.extname(job.file).toLowerCase();
  const base = job.file.replace(/\.[^.]+$/, '');
  const tempPath = path.join(IMAGES, `${base}.opt.tmp`);

  let pipeline = sharp(backupPath).rotate();
  const meta = await sharp(backupPath).metadata();

  if (meta.width && job.maxWidth && meta.width > job.maxWidth) {
    pipeline = pipeline.resize({ width: job.maxWidth, withoutEnlargement: true });
  }

  if (job.convertToJpeg || ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: job.jpegQuality, mozjpeg: true }).toFile(tempPath);
    const jpegPath = path.join(IMAGES, `${base}.jpg`);
    replaceFile(tempPath, jpegPath);
    if (job.convertToJpeg && job.file !== `${base}.jpg`) {
      fs.unlinkSync(input);
    }
    const after = restoreIfNeeded(jpegPath, backupPath, before);
    const webpSize = await writeWebp(jpegPath, path.join(IMAGES, `${base}.webp`), job.maxWidth);
    console.log(
      `  ${job.file}: ${formatKb(before)} → ${formatKb(after)} + webp ${formatKb(webpSize)}`
    );
    return { file: job.file, before, after, webpSize, output: `${base}.jpg` };
  }

  await pipeline
    .png({
      quality: job.pngQuality,
      compressionLevel: 9,
      palette: job.allowPalette !== false && !job.file.includes('pattern'),
    })
    .toFile(tempPath);

  replaceFile(tempPath, input);
  const after = restoreIfNeeded(input, backupPath, before);
  const webpSize = await writeWebp(input, path.join(IMAGES, `${base}.webp`), job.maxWidth);
  console.log(
    `  ${job.file}: ${formatKb(before)} → ${formatKb(after)} + webp ${formatKb(webpSize)}`
  );

  return { file: job.file, before, after, webpSize, output: job.file };
}

async function cleanupTempFiles() {
  for (const file of fs.readdirSync(IMAGES)) {
    if (file.endsWith('.tmp') || file.endsWith('.opt.tmp')) {
      fs.unlinkSync(path.join(IMAGES, file));
    }
  }
}

async function main() {
  fs.mkdirSync(BACKUP, { recursive: true });
  await cleanupTempFiles();

  console.log('Optimizing TEXAXIS images...\n');
  const results = [];

  for (const job of JOBS) {
    const result = await optimizeJob(job);
    if (result) results.push(result);
  }

  const totalBefore = results.reduce((sum, r) => sum + r.before, 0);
  const totalAfter = results.reduce((sum, r) => sum + r.after, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webpSize, 0);

  console.log('\n--- Summary ---');
  console.log(`Original total:  ${formatKb(totalBefore)}`);
  console.log(`Optimized total: ${formatKb(totalAfter)} (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}% saved)`);
  console.log(`WebP total:      ${formatKb(totalWebp)}`);
  console.log(`Backups saved to: images/_originals/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
