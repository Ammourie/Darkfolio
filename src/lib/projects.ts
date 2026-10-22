import fs from 'fs/promises';
import path from 'path';
import type { Language, Project } from '@/types/portfolio';

const PROJECTS_DIR = path.join(process.cwd(), 'public', 'projects');
const PROJECT_FILE = 'project.json';

export type ProjectLocaleContent = {
  title: string;
  description_short: string;
  description_long: string;
  tags: string[];
  date?: string;
};

/** On-disk project definition (one file per folder under public/projects). */
export type ProjectFile = {
  slug: string;
  order?: number;
  company?: string;
  main_image?: string;
  cover_image?: string;
  gallery_images?: string[];
  /** When true, gallery was fetched via download_play_screenshots.py; sync-all skips re-download. */
  google_play_gallery_synced?: boolean;
  /** When true, gallery was converted to JPEG via convert-play-galleries-to-jpeg.mjs. */
  google_play_gallery_jpeg?: boolean;
  google_play?: string;
  apple_store?: string;
  source_code_url?: string;
  locales: Partial<Record<Language, ProjectLocaleContent>>;
};

const projectFileCache = new Map<string, ProjectFile>();
let slugOrderCache: string[] | null = null;

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

/** Lists slugs for folders that contain project.json. */
export async function discoverProjectSlugs(): Promise<string[]> {
  if (slugOrderCache) return slugOrderCache;

  let entries: { name: string; isDirectory: () => boolean }[];
  try {
    entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  } catch {
    slugOrderCache = [];
    return slugOrderCache;
  }

  const slugs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifest = path.join(PROJECTS_DIR, entry.name, PROJECT_FILE);
    try {
      await fs.access(manifest);
      slugs.push(entry.name);
    } catch {
      /* skip folders without manifest */
    }
  }

  const withOrder = await Promise.all(
    slugs.map(async (slug) => {
      const file = await readProjectFile(slug);
      return { slug, order: file.order ?? Number.MAX_SAFE_INTEGER };
    })
  );
  withOrder.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  slugOrderCache = withOrder.map((x) => x.slug);
  return slugOrderCache;
}

async function readProjectFile(slug: string): Promise<ProjectFile> {
  const cached = projectFileCache.get(slug);
  if (cached) return cached;

  const filePath = path.join(PROJECTS_DIR, slug, PROJECT_FILE);
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as ProjectFile;
  data.slug = slug;
  projectFileCache.set(slug, data);
  return data;
}

/** Fills missing image paths from files in the project folder. */
async function resolveAssets(
  slug: string,
  file: ProjectFile
): Promise<Pick<Project, 'main_image' | 'cover_image' | 'gallery_images'>> {
  const base = `/projects/${slug}`;
  let main_image = file.main_image ?? '';
  let cover_image = file.cover_image ?? '';
  let gallery_images = file.gallery_images ?? [];

  const projectDir = path.join(PROJECTS_DIR, slug);
  const galleryDir = path.join(projectDir, 'gallery');

  if (!main_image || !cover_image) {
    try {
      const files = await fs.readdir(projectDir);
      if (!main_image) {
        const mainFile = files.find((f) => /^main\./i.test(f) && IMAGE_EXT.test(f));
        if (mainFile) main_image = `${base}/${mainFile}`;
      }
      if (!cover_image) {
        const coverFile = files.find((f) => /^cover\./i.test(f) && IMAGE_EXT.test(f));
        if (coverFile) cover_image = `${base}/${coverFile}`;
      }
    } catch {
      /* ignore */
    }
  }

  if (gallery_images.length === 0) {
    try {
      const files = (await fs.readdir(galleryDir)).filter((f) => IMAGE_EXT.test(f));
      files.sort();
      gallery_images = files.map((f) => `${base}/gallery/${f}`);
    } catch {
      /* ignore */
    }
  }

  return { main_image, cover_image, gallery_images };
}

/** Builds a localized Project from public/projects/{slug}/project.json. */
export async function getProjectBySlugFromDisk(
  slug: string,
  lang: Language = 'en'
): Promise<Project | undefined> {
  try {
    const file = await readProjectFile(slug);
    const locale = file.locales[lang] ?? file.locales.en;
    if (!locale) return undefined;

    const assets = await resolveAssets(slug, file);

    return {
      slug: file.slug,
      title: locale.title,
      description_short: locale.description_short,
      description_long: locale.description_long,
      tags: locale.tags ?? [],
      main_image: assets.main_image,
      cover_image: assets.cover_image,
      gallery_images: assets.gallery_images,
      company: file.company,
      date: locale.date,
      google_play: file.google_play,
      apple_store: file.apple_store,
      source_code_url: file.source_code_url,
    };
  } catch {
    return undefined;
  }
}

/** Loads every discovered project for a language, sorted by order. */
export async function getAllProjectsFromDisk(lang: Language = 'en'): Promise<Project[]> {
  const slugs = await discoverProjectSlugs();
  const projects = await Promise.all(slugs.map((slug) => getProjectBySlugFromDisk(slug, lang)));
  return projects.filter((p): p is Project => Boolean(p));
}

/** Clears in-memory project caches (e.g. after hot reload in dev). */
export function clearProjectCache() {
  projectFileCache.clear();
  slugOrderCache = null;
}
