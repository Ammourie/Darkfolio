import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLanguage, LANG_COOKIE } from '@/lib/language';

/** Forward resolved lang to the layout and persist ?lang= in a cookie. */
export function middleware(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get('lang');
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;

  let lang = isLanguage(cookieLang) ? cookieLang : 'en';
  if (isLanguage(langParam)) {
    lang = langParam;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-portfolio-lang', lang);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (isLanguage(langParam)) {
    response.cookies.set(LANG_COOKIE, lang, { path: '/', sameSite: 'lax' });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf|ico)$).*)'],
};
