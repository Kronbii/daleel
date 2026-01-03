/**
 * Shared constants for Daleel
 */

export const SUPPORTED_LOCALES = ["ar", "en", "fr"] as const;
export const DEFAULT_LOCALE = "ar" as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  fr: "Français",
};

// Placeholder photo styles
export const PLACEHOLDER_PHOTO_STYLES = ["GEOMETRIC", "INITIALS", "SILHOUETTE"] as const;

// Status colors for UI (neutral, not party-like)
export const STATUS_COLORS = {
  POTENTIAL: "bg-gray-100 text-gray-800",
  OFFICIAL: "bg-blue-100 text-blue-800",
  WITHDRAWN: "bg-yellow-100 text-yellow-800",
  DISQUALIFIED: "bg-red-100 text-red-800",
  DRAFT: "bg-gray-100 text-gray-800",
  ANNOUNCED: "bg-blue-100 text-blue-800",
  OFFICIAL_LIST: "bg-green-100 text-green-800",
  WITHDRAWN_LIST: "bg-yellow-100 text-yellow-800",
} as const;

// Rate limiting
export const RATE_LIMIT_CONFIG = {
  API_PUBLIC: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // requests per window
  },
  API_ADMIN: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // requests per window
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
  },
} as const;

// Security headers
export const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
} as const;

// CSP baseline (can be customized per route)
export const CSP_BASELINE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-eval in dev
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join("; ");

