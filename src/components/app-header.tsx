'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  isPageSectionId,
  PAGE_SECTION_IDS,
  scrollToSectionId,
} from '@/lib/scroll-nav';

interface AppHeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  navigation: {
    home: string;
    about: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    cv: string;
    contact: string;
  };
  menuLabels: { open: string; close: string };
}

/** Floating pill nav inspired by modern bento portfolio templates. */
export function AppHeader({
  currentLanguage,
  onLanguageChange,
  navigation,
  menuLabels,
}: AppHeaderProps) {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'about', label: navigation.about },
    { id: 'experience', label: navigation.experience },
    { id: 'education', label: navigation.education },
    { id: 'skills', label: navigation.skills },
    { id: 'projects', label: navigation.projects },
    { id: 'contact', label: navigation.contact },
  ] as const;

  const scrollToSection = useCallback((sectionId: string) => {
    scrollToSectionId(sectionId);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /** Highlight the section with the largest visible area. */
  useEffect(() => {
    const elements = PAGE_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!elements.length) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId = 'about';
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestRatio > 0) setActiveSection(bestId);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /** Deep-link hash on first load. */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!isPageSectionId(hash)) return;
    const t = window.setTimeout(() => scrollToSectionId(hash, 'auto'), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-[100] flex justify-center px-4 pt-3">
        <div
          className={cn(
            'pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full border px-2 py-1.5 transition-surface',
            isScrolled
              ? 'border-white/[0.1] bg-background/95 shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl'
              : 'border-white/[0.08] bg-background/80 backdrop-blur-lg'
          )}
        >
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className="hidden shrink-0 rounded-full px-3 py-1.5 text-sm font-bold font-headline text-foreground transition-surface hover:bg-white/[0.06] sm:block"
            aria-label={navigation.about}
          >
            MA
          </button>

          <nav
            className="hidden max-w-[min(100vw-8rem,42rem)] shrink-0 items-center gap-0.5 overflow-x-auto rounded-full bg-white/[0.04] p-0.5 md:flex [scrollbar-width:none]"
            aria-label={navigation.home}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-surface',
                    isActive
                      ? 'bg-background/90 text-foreground shadow-sm ring-1 ring-white/[0.08]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-0.5 md:border-s md:border-white/[0.08] md:ps-1">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              compact
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileOpen ? menuLabels.close : menuLabels.open}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[99] bg-black/50 backdrop-blur-[2px] md:hidden"
            aria-label={menuLabels.close}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="fixed inset-x-4 top-[4.25rem] z-[100] max-h-[min(70vh,calc(100dvh-6rem))] overflow-y-auto rounded-2xl border border-white/[0.08] bg-background/95 p-4 shadow-material-lg backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label={navigation.home}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="justify-start rounded-xl"
                  aria-current={activeSection === item.id ? 'true' : undefined}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
