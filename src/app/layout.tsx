import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { DocumentLangSync } from '@/components/document-lang-sync';
import { cookies, headers } from 'next/headers';
import { getPortfolioData } from '@/lib/data';
import { isLanguage, languageDirection, LANG_COOKIE } from '@/lib/language';
import type { Language } from '@/types/portfolio';

const inter = Inter({
  subsets: ['latin', 'latin-ext'], // Add latin-ext for better language support
  variable: '--font-inter',
  display: 'swap', // Improves loading performance
});

const SITE_NAME = 'Mohammed Al-Ammourie';

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} · Portfolio`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    'Portfolio of Mohammed Al-Ammourie — software developer and Flutter specialist building mobile and web products.',
};

async function resolveRequestLanguage(): Promise<Language> {
  const headerStore = await headers();
  const fromHeader = headerStore.get('x-portfolio-lang');
  if (isLanguage(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(LANG_COOKIE)?.value;
  if (isLanguage(fromCookie)) return fromCookie;

  return 'en';
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await resolveRequestLanguage();
  const dir = languageDirection(lang);

  await getPortfolioData(lang);

  return (
    <html lang={lang} dir={dir} className={`${inter.variable} dark`}>
      <body
        className={`font-sans antialiased ${dir === 'rtl' ? 'rtl' : 'ltr'}`}
        suppressHydrationWarning={true}
      >
        <DocumentLangSync />
        {children}
        <Toaster />
      </body>
    </html>
  );
}