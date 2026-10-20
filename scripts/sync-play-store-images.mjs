/**
 * Syncs main (app icon) and cover (dev-listing banner) from Google Play developer pages.
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const projectsDir = path.join(root, 'public', 'projects');
const PROJECT_FILE = 'project.json';

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

/** Developer listing pages (icon + cover banner per app). */
const DEVELOPER_PAGES = [
  'https://play.google.com/store/apps/developer?id=Osous+Technology&hl=en',
  'https://play.google.com/store/apps/developer?id=Darbak+LLC&hl=en',
];

/** Phone screenshot sizes — never used as cover. */
const PHONE_SHOT = /=w526-h296|=w1052-h592|=w392-h696|=w720-h1280/i;

function packageIdFromPlayUrl(url) {
  try {
    return new URL(url).searchParams.get('id');
  } catch {
    return null;
  }
}

function playBase(url) {
  return url.replace(/=w\d+-h\d+.*$/i, '').replace(/=s\d+.*$/i, '').replace(/\s2x$/i, '');
}

function pickSrcsetUrl(srcset) {
  const parts = srcset.split(',').map((s) => s.trim());
  const best = parts[parts.length - 1] ?? parts[0];
  return best.split(/\s+/)[0];
}

function iconFromDevUrl(url) {
  return `${playBase(url)}=w512-h512`;
}

function coverFromDevUrl(url) {
  const base = playBase(url);
  if (PHONE_SHOT.test(url)) return null;
  if (/=w\d+-h\d+/.test(url)) {
    return url.replace(/\s2x$/i, '');
  }
  return `${base}=w832-h470`;
}

/** Parses a Play developer page: packageId -> { icon, cover }. */
function parseDeveloperCatalog(html) {
  const catalog = new Map();
  const parts = html.split('details?id=');

  for (let i = 1; i < parts.length; i++) {
    const packageId = parts[i].match(/^([^"&]+)/)?.[1];
    if (!packageId || catalog.has(packageId)) continue;

    const block = parts[i].slice(0, 6000);
    const coverRaw =
      block.match(/srcset="([^"]+)"[^>]*alt="Screenshot image"/)?.[1] ??
      block.match(/src="([^"]+)"[^>]*alt="Screenshot image"/)?.[1];
    const iconRaw =
      block.match(/srcset="([^"]+)"[^>]*alt="Thumbnail image"/)?.[1] ??
      block.match(/src="([^"]+)"[^>]*alt="Thumbnail image"/)?.[1];

    if (!coverRaw || !iconRaw) continue;

    const coverSrc = coverRaw.includes(',') ? pickSrcsetUrl(coverRaw) : coverRaw;
    const iconSrc = iconRaw.includes(',') ? pickSrcsetUrl(iconRaw) : iconRaw;
    const cover = coverFromDevUrl(coverSrc);
    const icon = iconFromDevUrl(iconSrc);
    if (!cover || !icon) continue;

    catalog.set(packageId, { icon, cover });
  }

  return catalog;
}

/** App icon from detail page when app is missing on developer listings. */
async function fetchDetailIcon(googlePlayUrl) {
  const res = await fetch(`${googlePlayUrl}&hl=en`, { headers: FETCH_HEADERS });
  if (!res.ok) return null;
  const html = await res.text();
  const urls = [
    ...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[A-Za-z0-9_-]+(?:=[^"'\\s<>]+)?/g),
  ].map((m) => m[0].replace(/\s2x$/i, ''));

  const icon =
    urls.find((u) => /=w512-h512/i.test(u)) ??
    urls.find((u) => /=w240-h480/i.test(u));

  return icon ? iconFromDevUrl(icon) : null;
}

function extFromContentType(type) {
  if (!type) return 'png';
  if (type.includes('webp')) return 'webp';
  if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
  return 'png';
}

async function download(url) {
  const res = await fetch(url, { redirect: 'follow', headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = extFromContentType(res.headers.get('content-type'));
  return { buffer, ext };
}

async function writeImage(projectDir, baseName, url) {
  const { buffer, ext } = await download(url);
  const fileName = `${baseName}.${ext}`;
  await fs.writeFile(path.join(projectDir, fileName), buffer);
  return fileName;
}

async function loadDeveloperCatalogs() {
  const merged = new Map();
  for (const pageUrl of DEVELOPER_PAGES) {
    const res = await fetch(pageUrl, { headers: FETCH_HEADERS });
    if (!res.ok) throw new Error(`Developer page HTTP ${res.status}: ${pageUrl}`);
    const catalog = parseDeveloperCatalog(await res.text());
    console.log(`  ${pageUrl} → ${catalog.size} apps`);
    for (const [id, assets] of catalog) merged.set(id, assets);
  }
  return merged;
}

async function syncProject(slug, project, catalog) {
  const projectDir = path.join(projectsDir, slug);
  await fs.mkdir(projectDir, { recursive: true });
  const basePath = `/projects/${slug}`;

  if (project.google_play) {
    const id = packageIdFromPlayUrl(project.google_play);
    console.log(`\n${slug} (${id})`);
    const entry = id ? catalog.get(id) : null;

    if (entry) {
      const mainFile = await writeImage(projectDir, 'main', entry.icon);
      project.main_image = `${basePath}/${mainFile}`;
      console.log(`  main (dev icon) -> ${project.main_image}`);

      const coverFile = await writeImage(projectDir, 'cover', entry.cover);
      project.cover_image = `${basePath}/${coverFile}`;
      console.log(`  cover (dev banner) -> ${project.cover_image}`);
    } else {
      console.warn('  not on developer listings — icon from app detail; cover unchanged');
      const iconUrl = await fetchDetailIcon(project.google_play);
      if (iconUrl) {
        const mainFile = await writeImage(projectDir, 'main', iconUrl);
        project.main_image = `${basePath}/${mainFile}`;
        console.log(`  main (detail icon) -> ${project.main_image}`);
      }
    }
  } else {
    console.log(`\n${slug} (no google_play)`);
  }

  await fs.writeFile(path.join(projectDir, PROJECT_FILE), `${JSON.stringify(project, null, 2)}\n`, 'utf8');
}

async function main() {
  console.log('Loading developer catalogs…');
  const catalog = await loadDeveloperCatalogs();
  console.log(`Merged catalog: ${catalog.size} apps.`);

  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(projectsDir, entry.name, PROJECT_FILE);
    try {
      await fs.access(manifestPath);
    } catch {
      continue;
    }
    const project = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    try {
      await syncProject(entry.name, project, catalog);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }
  }
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
