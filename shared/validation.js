/**
 * Validation utilities and common patterns
 */
import { z } from "zod";
// Common validation patterns
export const urlSchema = z
    .string()
    .url("Invalid URL format")
    .refine((url) => {
    try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
    }
    catch {
        return false;
    }
}, { message: "URL must use http or https protocol" });
export const slugSchema = z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");
export const emailSchema = z.string().email("Invalid email address");
export const localeSchema = z.enum(["ar", "en", "fr"]);
// Multilingual text schema
export const multilingualTextSchema = z.object({
    ar: z.string().min(1, "Arabic text is required"),
    en: z.string().min(1, "English text is required"),
    fr: z.string().min(1, "French text is required"),
});
// Optional multilingual text schema
export const optionalMultilingualTextSchema = z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
    fr: z.string().optional(),
});
// ID validation
export const uuidSchema = z.string().uuid("Invalid ID format");
// Pagination
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
// Date validation
export const dateSchema = z.coerce.date();
// Archive method enum
export const archiveMethodSchema = z.enum([
    "WAYBACK",
    "PDF",
    "SCREENSHOT",
    "VIDEO_DOWNLOAD",
    "MANUAL",
]);
//# sourceMappingURL=validation.js.map