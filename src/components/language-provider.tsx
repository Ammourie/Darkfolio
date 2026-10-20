'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { isLanguage, languageDirection } from '@/lib/language';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

export function LanguageProvider({ children, initialLanguage = 'en' }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL params for language
    const langParam = searchParams.get('lang');
    if (langParam && ['en', 'ar'].includes(langParam)) {
      setCurrentLanguage(langParam);
    } else {
      // Check localStorage for saved language preference
      const savedLanguage = localStorage.getItem('preferred-language');
      if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, [searchParams]);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  /** Keep <html lang/dir> in sync after client navigations. */
  useEffect(() => {
    const lang = isLanguage(currentLanguage) ? currentLanguage : 'en';
    const dir = languageDirection(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle('rtl', dir === 'rtl');
    document.body.classList.toggle('ltr', dir === 'ltr');
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 