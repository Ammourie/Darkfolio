/**
 * Converts Play-synced gallery images to high-quality JPEG via ffmpeg (smaller files, same resolution).
 * Targets projects with google_play_gallery_synced. Does not skip google_play_gallery_jpeg by default;
 * use --skip-jpeg to only process projects not yet converted.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const projectsDir = path.join(root, 'public', 'projects');
const PROJECT_FILE = 'project.json';

const FFMPEG =
  process.env.FFMPEG ??
  'C:\\Users\\moham\\OneDrive\\Documents\\ffmpeg-master-latest-win64-gpl-shared_2\\bin\\ffmpeg.exe';

/** MJPEG qscale 2 ≈ very high quality (~95+ JPEG). */
const JPEG_Q = '2';

const skipJpeg = process.argv.includes('--skip-jpeg');
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

function convertToJpeg(srcPath, destPath) {
  execFileSync(
    FFMPEG,
    ['-y', '-i', srcPath, '-q:v', JPEG_Q, destPath],
    { stdio: 'pipe' },
  );
}

for (const slug of fs.readdirSync(projectsDir)) {
  const manifestPath = path.join(projectsDir, slug, PROJECT_FILE);
  if (!fs.existsSync(manifestPath)) continue;

  const project = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!project.google_play_gallery_synced) {
    console.log(`\n${slug}: skip (not google_play_gallery_synced)`);
    continue;
  }

  if (skipJpeg && project.google_play_gallery_jpeg) {
    console.log(`\n${slug}: skip (google_play_gallery_jpeg)`);
    continue;
  }

  const galleryDir = path.join(projectsDir, slug, 'gallery');
  if (!fs.existsSync(galleryDir)) {
    console.log(`\n${slug}: skip (no gallery folder)`);
    continue;
  }

  console.log(`\n${slug}`);
  const entries = fs.readdirSync(galleryDir).filter((f) => IMAGE_EXT.test(f));
  entries.sort();

  for (const file of entries) {
    const src = path.join(galleryDir, file);
    const stem = file.replace(/\.[^.]+$/, '');
    const dest = path.join(galleryDir, `${stem}.jpg`);

    if (path.resolve(src) === path.resolve(dest)) {
      const tmp = path.join(galleryDir, `${stem}.__tmp.jpg`);
      convertToJpeg(src, tmp);
      fs.renameSync(tmp, dest);
      const before = fs.statSync(dest).size;
      console.log(`  ${file} -> ${stem}.jpg (re-encoded, ${(before / 1024).toFixed(0)} KB)`);
      continue;
    }

    convertToJpeg(src, dest);
    fs.unlinkSync(src);
    const kb = fs.statSync(dest).size / 1024;
    console.log(`  ${file} -> ${stem}.jpg (${kb.toFixed(0)} KB)`);
  }

  const jpegs = fs
    .readdirSync(galleryDir)
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort();
  project.gallery_images = jpegs.map((f) => `/projects/${slug}/gallery/${f}`);
  project.google_play_gallery_jpeg = true;
  fs.writeFileSync(manifestPath, `${JSON.stringify(project, null, 2)}\n`, 'utf8');
  console.log(`  gallery_images: ${jpegs.length}, google_play_gallery_jpeg: true`);
}

console.log('\nGallery JPEG conversion done.');
