/**
 * Runs download_play_screenshots.py for projects with google_play that are not yet synced.
 * Sets google_play_gallery_synced: true on success. Use --force to re-download all.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const projectsDir = path.join(root, 'public', 'projects');
const pyScript = path.join(__dirname, 'download_play_screenshots.py');
const PROJECT_FILE = 'project.json';
const force = process.argv.includes('--force');

for (const slug of fs.readdirSync(projectsDir)) {
  const manifestPath = path.join(projectsDir, slug, PROJECT_FILE);
  if (!fs.existsSync(manifestPath)) continue;

  const project = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const playUrl = project.google_play?.trim();
  if (!playUrl) {
    console.log(`\n${slug}: skip (no google_play)`);
    continue;
  }

  if (project.google_play_gallery_synced && !force) {
    console.log(`\n${slug}: skip (google_play_gallery_synced)`);
    continue;
  }

  const galleryDir = path.join(projectsDir, slug, 'gallery');
  fs.mkdirSync(galleryDir, { recursive: true });
  for (const f of fs.readdirSync(galleryDir)) {
    fs.unlinkSync(path.join(galleryDir, f));
  }

  console.log(`\n${slug}`);
  execFileSync('py', [pyScript, playUrl, '-o', galleryDir], {
    cwd: root,
    stdio: 'inherit',
  });

  const files = fs.readdirSync(galleryDir).sort();
  project.gallery_images = files.map((f) => `/projects/${slug}/gallery/${f}`);
  project.google_play_gallery_synced = true;
  fs.writeFileSync(manifestPath, `${JSON.stringify(project, null, 2)}\n`, 'utf8');
  console.log(`  gallery_images: ${files.length} file(s), google_play_gallery_synced: true`);
}

console.log('\nAll Play galleries synced.');
