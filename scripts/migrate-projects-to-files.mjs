/**
 * Splits projects from locale JSON into public/projects/{slug}/project.json
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const localesDir = path.join(root, 'public', 'locales');
const projectsDir = path.join(root, 'public', 'projects');

function pickStoreLinks(project) {
  if (!project) return {};
  const google_play =
    project.google_play ?? project.store_links?.google_play ?? undefined;
  const apple_store =
    project.apple_store ?? project.store_links?.apple_store ?? undefined;
  return { google_play, apple_store, source_code_url: project.source_code_url };
}

function localeSlice(project) {
  if (!project) return null;
  return {
    title: project.title,
    description_short: project.description_short,
    description_long: project.description_long,
    tags: project.tags ?? [],
    date: project.date,
  };
}

async function main() {
  const en = JSON.parse(await fs.readFile(path.join(localesDir, 'en.json'), 'utf8'));
  const ar = JSON.parse(await fs.readFile(path.join(localesDir, 'ar.json'), 'utf8'));

  const enProjects = en.projects ?? [];
  const arProjects = ar.projects ?? [];

  for (let i = 0; i < enProjects.length; i += 1) {
    const enP = enProjects[i];
    const arP =
      arProjects.find((p) => p.slug === enP.slug) ??
      arProjects[i] ??
      null;

    const slug = enP.slug;
    const stores = { ...pickStoreLinks(arP), ...pickStoreLinks(enP) };

    const file = {
      slug,
      order: i,
      company: enP.company ?? arP?.company,
      google_play: stores.google_play,
      apple_store: stores.apple_store,
      source_code_url: stores.source_code_url,
      main_image: enP.main_image ?? '',
      gallery_images: enP.gallery_images ?? [],
      locales: {
        en: localeSlice(enP),
        ar: localeSlice(arP) ?? localeSlice(enP),
      },
    };

    const outDir = path.join(projectsDir, slug);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(
      path.join(outDir, 'project.json'),
      `${JSON.stringify(file, null, 2)}\n`,
      'utf8'
    );
    console.log(`Wrote ${slug}/project.json`);
  }

  delete en.projects;
  delete ar.projects;

  await fs.writeFile(path.join(localesDir, 'en.json'), `${JSON.stringify(en, null, 2)}\n`, 'utf8');
  await fs.writeFile(path.join(localesDir, 'ar.json'), `${JSON.stringify(ar, null, 2)}\n`, 'utf8');
  console.log('Removed projects[] from locale files.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
