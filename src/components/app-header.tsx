'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { CvDownloads, type CvDownloadLabels } from '@/components/cv-downloads';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  cvLabels: CvDownloadLabels;
}

const SECTION_IDS = ['hero', 'about', 'experience', 'education', 'skills', 'projects', 'contact'] as const;

/** Floating pill nav inspired by modern bento portfolio templates. */
export function AppHeader({
  currentLanguage,
  onLanguageChange,
  navigation,
  cvLabels,
}: AppHeaderProps) {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: navigation.home },
    { id: 'about', label: navigation.about },
    { id: 'experience', label: navigation.experience },
    { id: 'projects', label: navigation.projects },
    { id: 'contact', label: navigation.contact },
  ];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto flex w-full max-w-3xl items-center gap-1 rounded-full border border-white/[0.08]',
            'bg-background/70 px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl'
          )}
        >
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="hidden shrink-0 rounded-full px-3 py-1.5 text-sm font-bold font-headline text-foreground sm:block"
          >
            MA
          </button>

          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-surface',
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.06]'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-1">
            <div className="hidden lg:block">
              <CvDownloads labels={cvLabels} size="sm" className="gap-1" />
            </div>
            <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-x-4 top-[4.5rem] z-50 rounded-2xl border border-white/[0.08] bg-background/95 p-4 shadow-material-lg backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {[...navItems, { id: 'skills', label: navigation.skills }, { id: 'education', label: navigation.education }].map(
              (item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="justify-start rounded-xl"
                >
                  {item.label}
                </Button>
              )
            )}
          </nav>
          <div className="mt-3 border-t border-border/60 pt-3">
            <CvDownloads labels={cvLabels} size="sm" onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
