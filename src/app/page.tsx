import { getPortfolioData } from '@/lib/data';
import { BackgroundDecorations } from '@/components/background-decorations';
import { ClientPageWrapper } from '@/components/client-page-wrapper';
import { PortfolioBentoHome } from '@/components/portfolio/portfolio-bento-home';
import { Language } from '@/types/portfolio';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function isLanguage(lang: unknown): lang is Language {
  return lang === 'en' || lang === 'ar';
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const langParam = params?.lang;
  const currentLanguage: Language = isLanguage(langParam) ? langParam : 'en';
  const data = await getPortfolioData(currentLanguage);

  const avatarSrc =
    data.personal.avatar ||
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  const phoneHref = (data.personal.phone || '').replace(/\s+/g, '');

  const cvLabels = {
    english: data.static_strings['download_cv_english'],
    arabic: data.static_strings['download_cv_arabic'],
  };

  return (
    <ClientPageWrapper
      initialLanguage={currentLanguage}
      navigation={data.navigation}
      skipToContentLabel={data.static_strings['skip_to_content']}
      menuLabels={{
        open: data.static_strings['open_menu'],
        close: data.static_strings['close_menu'],
      }}
    >
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        <BackgroundDecorations />
        <PortfolioBentoHome
          data={data}
          lang={currentLanguage}
          avatarSrc={avatarSrc}
          cvLabels={cvLabels}
          phoneHref={phoneHref}
        />
      </div>
    </ClientPageWrapper>
  );
}
