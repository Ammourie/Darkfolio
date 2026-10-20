import type { Language } from '@/types/portfolio';

/** Supported locale codes from ?lang= or cookie. */
export function isLanguage(lang: unknown): lang is Language {
  return lang === 'en' || lang === 'ar';
}

export const RTL_LANGUAGES: Language[] = ['ar'];

export function languageDirection(lang: Language): 'rtl' | 'ltr' {
  return RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}

export const LANG_COOKIE = 'portfolio-lang';
