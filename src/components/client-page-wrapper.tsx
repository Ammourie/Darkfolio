'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { LanguageProvider, useLanguage } from '@/components/language-provider';
interface ClientPageWrapperProps {
  children: React.ReactNode;
  initialLanguage: string;
  navigation: any;
  skipToContentLabel: string;
  menuLabels: { open: string; close: string };
}

function PageContent({
  children,
  navigation,
  skipToContentLabel,
  menuLabels,
}: {
  children: React.ReactNode;
  navigation: any;
  skipToContentLabel: string;
  menuLabels: { open: string; close: string };
}) {
  const { currentLanguage, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
    
    // Update URL with language parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', language);
    const newPath = `${window.location.pathname}?${params.toString()}`;
    router.push(newPath);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        {skipToContentLabel}
      </a>
      <AppHeader
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        navigation={navigation}
        menuLabels={menuLabels}
      />
      {children}
    </>
  );
}

export function ClientPageWrapper({
  children,
  initialLanguage,
  navigation,
  skipToContentLabel,
  menuLabels,
}: ClientPageWrapperProps) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageContent
        navigation={navigation}
        skipToContentLabel={skipToContentLabel}
        menuLabels={menuLabels}
      >
        {children}
      </PageContent>
    </LanguageProvider>
  );
} 