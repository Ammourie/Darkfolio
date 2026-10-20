/**
 * Downloads remote project images into public/projects/{slug}/ and updates project.json.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const projectsPublicDir = path.join(root, 'public', 'projects');
const PROJECT_FILE = 'project.json';

const REMOTE = /^https?:\/\//i;

function extFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.(jpe?g|png|webp|gif)$/i);
    if (match) return match[1].toLowerCase().replace('jpeg', 'jpg');
  } catch {
    /* ignore */
  }
  return null;
}

function extFromContentType(type) {
  if (!type) return 'jpg';
  if (type.includes('png')) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('gif')) return 'gif';
  return 'jpg';
}

async function downloadImage(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromUrl(url) ?? extFromContentType(res.headers.get('content-type'));
  return { buffer, ext };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function localizeProjectManifest(slug, project) {
  const projectDir = path.join(projectsPublicDir, slug);
  const galleryDir = path.join(projectDir, 'gallery');

  let main_image = project.main_image;
  let cover_image = project.cover_image;
  if (cover_image && REMOTE.test(cover_image)) {
    await ensureDir(projectDir);
    const { buffer, ext } = await downloadImage(cover_image);
    const fileName = `cover.${ext}`;
    await fs.writeFile(path.join(projectDir, fileName), buffer);
    cover_image = `/projects/${slug}/${fileName}`;
    console.log(`  cover -> ${cover_image}`);
  }

  if (main_image && REMOTE.test(main_image)) {
    await ensureDir(projectDir);
    const { buffer, ext } = await downloadImage(main_image);
    const fileName = `main.${ext}`;
    await fs.writeFile(path.join(projectDir, fileName), buffer);
    main_image = `/projects/${slug}/${fileName}`;
    console.log(`  main -> ${main_image}`);
  }

  const gallery_images = [];
  if (Array.isArray(project.gallery_images)) {
    await ensureDir(galleryDir);
    let index = 0;
    for (const url of project.gallery_images) {
      if (!url || !REMOTE.test(url)) {
        gallery_images.push(url);
        continue;
      }
      index += 1;
      const { buffer, ext } = await downloadImage(url);
      const fileName = `${String(index).padStart(2, '0')}.${ext}`;
      await fs.writeFile(path.join(galleryDir, fileName), buffer);
      gallery_images.push(`/projects/${slug}/gallery/${fileName}`);
      console.log(`  gallery ${fileName}`);
    }
  }

  return { ...project, main_image, cover_image, gallery_images };
}

async function main() {
  const entries = await fs.readdir(projectsPublicDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const manifestPath = path.join(projectsPublicDir, slug, PROJECT_FILE);
    try {
      await fs.access(manifestPath);
    } catch {
      continue;
    }

    const project = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    const hasRemote =
      (project.main_image && REMOTE.test(project.main_image)) ||
      (project.cover_image && REMOTE.test(project.cover_image)) ||
      (project.gallery_images || []).some((u) => u && REMOTE.test(u));

    console.log(`\n${slug}`);
    if (!hasRemote) {
      console.log('  (no remote images)');
      continue;
    }

    const updated = await localizeProjectManifest(slug, project);
    await fs.writeFile(manifestPath, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
