import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication (localized slugs and internal paths)
const protectedRoutes = [
  '/student',
  '/teacher',
  '/admin',
  '/schueler',
  '/lehrer',
];

/**
 * All localized slugs that map to auth pages.
 * These are the slugs as they appear in the URL (after the locale prefix).
 * Kept in sync with routing.ts pathnames.
 */
const authSlugs = [
  // de-de slugs
  '/anmelden',
  '/registrieren',
  '/otp',
  '/passwort-zuruecksetzen',
  '/neues-passwort',
  // en-gb slugs
  '/login',
  '/register',
  '/reset-password',
  '/set-new-password',
];

/** Supported locale prefixes */
const LOCALE_REGEX = /^\/(de-de|en-gb)(\/|$)/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Run next-intl middleware first to handle locale prefixing & slug rewriting
  const response = intlMiddleware(request);

  // 2. Strip locale prefix to get the path segment used for route matching
  const pathnameWithoutLocale =
    pathname.replace(LOCALE_REGEX, '/').replace(/\/$/, '') || '/';

  // 3. Extract locale for redirect URLs (default to de-de)
  const localeMatch = pathname.match(LOCALE_REGEX);
  const locale = localeMatch ? localeMatch[1] : 'de-de';

  // 4. Check for auth tokens in cookies
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const accessToken = request.cookies.get('accessToken')?.value;
  const hasValidToken = !!(refreshToken || accessToken);

  // 5. Protected routes → redirect to locale-prefixed login if unauthenticated
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(route + '/')
  );

  if (isProtectedRoute) {
    if (!hasValidToken) {
      // Redirect to the localized login slug
      const loginSlug = locale === 'de-de' ? 'anmelden' : 'login';
      const loginUrl = new URL(`/${locale}/${loginSlug}`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 6. Auth slugs → redirect to locale home if already authenticated
  if (authSlugs.some((slug) => pathnameWithoutLocale.startsWith(slug))) {
    if (hasValidToken) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except /api, /_next, /_vercel, and static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
