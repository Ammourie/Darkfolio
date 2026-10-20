import fs from 'fs/promises';
import path from 'path';
import type { PortfolioData, ThemeConfig, Language, LocaleData } from '@/types/portfolio';
import {
  discoverProjectSlugs,
  getAllProjectsFromDisk,
  getProjectBySlugFromDisk,
} from '@/lib/projects';

const dataCache = new Map<Language, LocaleData>();
let cachedTheme: ThemeConfig | null = null;

export async function getThemeConfig(): Promise<ThemeConfig> {
  if (cachedTheme) {
    return cachedTheme;
  }

  const filePath = path.join(process.cwd(), 'public', 'config', 'theme.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    cachedTheme = JSON.parse(jsonData);
    return cachedTheme!;
  } catch (error) {
    console.error('Could not read or parse theme.json', error);
    return {
      colors: {
        primary: { '500': '#2196f3' },
        secondary: { '500': '#9c27b0' },
        accent: { '500': '#009688' },
        neutral: { '500': '#9e9e9e' },
      },
      typography: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          headline: ['Poppins', 'system-ui', 'sans-serif'],
        },
      },
      spacing: {},
      shadows: {},
      borderRadius: {},
    };
  }
}

/** Locale copy from public/locales; projects from public/projects (project.json per folder). */
export async function getLocaleData(locale: Language = 'en'): Promise<LocaleData> {
  if (dataCache.has(locale)) {
    const cached = dataCache.get(locale)!;
    const projects = await getAllProjectsFromDisk(locale);
    return { ...cached, projects };
  }

  const filePath = path.join(process.cwd(), 'public', 'locales', `${locale}.json`);
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(jsonData) as LocaleData;
    const projects = await getAllProjectsFromDisk(locale);
    const merged = { ...data, projects };
    dataCache.set(locale, data);
    return merged;
  } catch (error) {
    console.error(`Could not read or parse ${locale}.json`, error);
    if (locale !== 'en') {
      return getLocaleData('en');
    }
    return {
      displayName: 'English',
      navigation: {} as LocaleData['navigation'],
      personal: {} as LocaleData['personal'],
      about: {} as LocaleData['about'],
      sections: {} as LocaleData['sections'],
      footer: {} as LocaleData['footer'],
      static_strings: {},
      projects: [],
    };
  }
}

export async function getPortfolioData(lang: Language = 'en'): Promise<PortfolioData> {
  const localeData = await getLocaleData(lang);
  const theme = await getThemeConfig();
  return {
    ...localeData,
    theme,
  };
}

export async function getProjectBySlug(slug: string, lang: Language = 'en') {
  return getProjectBySlugFromDisk(slug, lang);
}

export async function getAllProjectSlugs(_lang: Language = 'en'): Promise<{ slug: string }[]> {
  const slugs = await discoverProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function getAvailableLocales(): Promise<string[]> {
  try {
    const localesDir = path.join(process.cwd(), 'public', 'locales');
    const files = await fs.readdir(localesDir);
    return files.filter((file) => file.endsWith('.json')).map((file) => file.replace('.json', ''));
  } catch (error) {
    console.error('Could not read locales directory', error);
    return ['en'];
  }
}
