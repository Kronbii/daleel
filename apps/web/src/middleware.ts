import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, SECURITY_HEADERS, CSP_BASELINE } from "@daleel/core";

const intlMiddleware = createMiddleware({
  locales: SUPPORTED_LOCALES as any,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // Always use Arabic as default, ignore browser locale detection
  localeDetection: false,
});

export function middleware(request: NextRequest) {
  // Apply internationalization first
  const response = intlMiddleware(request);

  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Set CSP header
  response.headers.set("Content-Security-Policy", CSP_BASELINE);

  // Additional security: X-XSS-Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Strict Transport Security (HSTS) - only in production with HTTPS
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

