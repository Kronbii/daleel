/**
 * Shared TypeScript types
 */

import type { Locale } from "./constants";

export type TranslationObject = {
  ar: string;
  en: string;
  fr: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

// Helper to get localized string
export function getLocalized(
  obj: TranslationObject,
  locale: Locale
): string {
  return obj[locale] || obj.en || obj.ar || "";
}

// Sanitization utilities
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http/https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Invalid protocol");
    }
    return parsed.toString();
  } catch {
    throw new Error("Invalid URL format");
  }
}

