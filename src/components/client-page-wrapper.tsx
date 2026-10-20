'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { LanguageProvider, useLanguage } from '@/components/language-provider';
import type { CvDownloadLabels } from '@/components/cv-downloads';

interface ClientPageWrapperProps {
  children: React.ReactNode;
  initialLanguage: string;
  navigation: any;
  cvLabels: CvDownloadLabels;
}

function PageContent({
  children,
  navigation,
  cvLabels,
}: {
  children: React.ReactNode;
  navigation: any;
  cvLabels: CvDownloadLabels;
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
      <AppHeader
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        navigation={navigation}
        cvLabels={cvLabels}
      />
      {children}
    </>
  );
}

export function ClientPageWrapper({
  children,
  initialLanguage,
  navigation,
  cvLabels,
}: ClientPageWrapperProps) {
  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <PageContent navigation={navigation} cvLabels={cvLabels}>
        {children}
      </PageContent>
    </LanguageProvider>
  );
} 