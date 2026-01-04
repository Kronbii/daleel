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
export type ApiResponse<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
    code?: string;
};
export declare function getLocalized(obj: TranslationObject, locale: Locale): string;
export declare function sanitizeSlug(input: string): string;
export declare function sanitizeUrl(url: string): string;
//# sourceMappingURL=types.d.ts.map