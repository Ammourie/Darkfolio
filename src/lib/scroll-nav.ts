/** Fixed header offset for in-page anchor scrolling. */
export const HEADER_SCROLL_OFFSET = 96;

/** Scroll to a section id with header offset. */
export function scrollToSectionId(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  const element = document.getElementById(sectionId);
  if (!element) return false;
  const y = element.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior });
  return true;
}

export const PAGE_SECTION_IDS = [
  'about',
  'experience',
  'education',
  'skills',
  'projects',
  'contact',
] as const;

export type PageSectionId = (typeof PAGE_SECTION_IDS)[number];

export function isPageSectionId(id: string): id is PageSectionId {
  return (PAGE_SECTION_IDS as readonly string[]).includes(id);
}
