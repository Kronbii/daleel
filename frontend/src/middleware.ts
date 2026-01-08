import createMiddleware from "next-intl/middleware";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@daleel/shared";

export default createMiddleware({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  // Don't add locale prefix for default locale (optional - remove if you want /ar prefix always)
  // localePrefix: "as-needed",
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Internal Next.js paths (including __server_sent_events__)
  matcher: ["/((?!api|_next|_vercel|__.*|.*\\..*).*)",],
};
