'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Download, Menu, X } from 'lucide-react';
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
}

export function AppHeader({ currentLanguage, onLanguageChange, navigation }: AppHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    /**
     * Toggles a more compact/solid header style after the user scrolls.
     * This keeps the navigation readable over the hero background.
     */
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Smoothly scrolls to the given section id while accounting for the fixed header.
   */
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: navigation.home },
    { id: 'about', label: navigation.about },
    { id: 'experience', label: navigation.experience },
    { id: 'education', label: navigation.education },
    { id: 'skills', label: navigation.skills },
    { id: 'projects', label: navigation.projects },
    { id: 'contact', label: navigation.contact },
  ];

  /**
   * Public path for the CV PDF. `public/cv/cv.pdf` becomes `/cv/cv.pdf` at runtime.
   */
  const cvHref = '/cv/cv.pdf';
  const cvDownloadName = 'Mohammed-Ammourie-CV.pdf';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              Portfolio
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 rounded-lg"
              >
                {item.label}
              </Button>
            ))}

            {/* CV Download */}
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="ml-2 px-3 py-2 text-sm font-semibold rounded-lg"
            >
              <a href={cvHref} download={cvDownloadName} aria-label={navigation.cv}>
                <Download className="h-4 w-4" />
                {navigation.cv}
              </a>
            </Button>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-1 py-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="justify-start px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  {item.label}
                </Button>
              ))}

              {/* CV Download */}
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="justify-start mx-4 mt-2 px-4 py-3 text-sm font-semibold rounded-lg"
              >
                <a
                  href={cvHref}
                  download={cvDownloadName}
                  aria-label={navigation.cv}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Download className="h-4 w-4" />
                  {navigation.cv}
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 