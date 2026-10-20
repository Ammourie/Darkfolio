'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { isLanguage, languageDirection } from '@/lib/language';

/** Syncs html lang/dir when ?lang= changes (project pages, direct links). */
function DocumentLangSyncInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const param = searchParams.get('lang');
    const lang = isLanguage(param) ? param : isLanguage(document.documentElement.lang) ? document.documentElement.lang : 'en';
    const dir = languageDirection(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.body.classList.toggle('rtl', dir === 'rtl');
    document.body.classList.toggle('ltr', dir === 'ltr');
  }, [searchParams]);

  return null;
}

export function DocumentLangSync() {
  return (
    <Suspense fallback={null}>
      <DocumentLangSyncInner />
    </Suspense>
  );
}
