/**
 * Downloads remote project images into public/projects/{slug}/ and updates locale JSON.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const localesDir = path.join(root, 'public', 'locales');
const projectsPublicDir = path.join(root, 'public', 'projects');

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

/** Fetch image bytes and resolved file extension. */
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

/** Mirror one project's images to disk; return local paths. */
async function localizeProject(project) {
  const { slug } = project;
  const projectDir = path.join(projectsPublicDir, slug);
  const galleryDir = path.join(projectDir, 'gallery');

  let main_image = project.main_image;
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

  return { ...project, main_image, gallery_images };
}

async function updateLocaleFile(fileName, localizedBySlug) {
  const filePath = path.join(localesDir, fileName);
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
  if (!Array.isArray(data.projects)) return;

  data.projects = data.projects.map((p) => {
    const localized = localizedBySlug.get(p.slug);
    if (!localized) return p;
    return {
      ...p,
      main_image: localized.main_image,
      gallery_images: localized.gallery_images,
    };
  });

  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated ${fileName}`);
}

async function main() {
  const enPath = path.join(localesDir, 'en.json');
  const en = JSON.parse(await fs.readFile(enPath, 'utf8'));
  const localizedBySlug = new Map();

  for (const project of en.projects || []) {
    console.log(`\n${project.slug}`);
    const hasRemote =
      (project.main_image && REMOTE.test(project.main_image)) ||
      (project.gallery_images || []).some((u) => u && REMOTE.test(u));
    if (!hasRemote) {
      localizedBySlug.set(project.slug, project);
      console.log('  (no remote images)');
      continue;
    }
    localizedBySlug.set(project.slug, await localizeProject(project));
  }

  await updateLocaleFile('en.json', localizedBySlug);
  await updateLocaleFile('ar.json', localizedBySlug);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
