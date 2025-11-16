import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];

  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    [
      '/api', // Exclude /api routes
      // Add other paths to exclude from localization here
      // e.g., '/_next/static', '/_next/image', '/favicon.ico'
    ].some((path) => pathname.startsWith(path))
  ) {
    return;
  }


  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request) || i18n.defaultLocale;
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|.*\\..*).*)',
    // Optional: only run middleware on DYNAMIC RENDERED pages
    // '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
