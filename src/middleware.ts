import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/student", "/teacher", "/admin"];

// Routes only for unauthenticated users
const authRoutes = ["/login", "/register", "/otp", "/reset", "/setnewpassword"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Run next-intl middleware first to handle locale prefixing
  const response = intlMiddleware(request);

  // 2. Custom Auth Logic
  // We need to check if the path (without locale) matches our routes
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de)/, "") || "/";
  
  // Check for tokens in cookies
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasValidToken = refreshToken || accessToken;

  // Protected routes - redirect to login if no token
  if (protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
    if (!hasValidToken) {
      const locale = pathname.split('/')[1] || 'en';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes - redirect to home if already logged in
  if (authRoutes.some((route) => pathnameWithoutLocale.startsWith(route))) {
    if (hasValidToken) {
      const locale = pathname.split('/')[1] || 'en';
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return response;
}

export const config = {
  // Matcher for internationalized routes
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, we still want to keep our specific matchers from before
    "/student/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/otp",
    "/reset",
    "/setnewpassword",
  ],
};
