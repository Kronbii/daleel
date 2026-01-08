import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@daleel/shared";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
});

export default function middleware(request: NextRequest) {
  // Explicitly skip internal Next.js paths like /__server_sent_events__
  // This is a fallback in case the matcher regex misses them
  if (request.nextUrl.pathname.startsWith('/__')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Internal Next.js paths (including __server_sent_events__)
  matcher: ["/((?!api|_next|_vercel|__.*|.*\\..*).*)",],
};
