/**
 * Shared TypeScript types
 */
// Helper to get localized string
export function getLocalized(obj, locale) {
    return obj[locale] || obj.en || obj.ar || "";
}
// Sanitization utilities
export function sanitizeSlug(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/[\s_]+/g, "-") // Replace spaces/underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}
export function sanitizeUrl(url) {
    try {
        const parsed = new URL(url);
        // Only allow http/https
        if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid protocol");
        }
        return parsed.toString();
    }
    catch {
        throw new Error("Invalid URL format");
    }
}
//# sourceMappingURL=types.js.map