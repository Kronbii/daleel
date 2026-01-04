/**
 * Validation utilities and common patterns
 */
import { z } from "zod";
export declare const urlSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const slugSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const localeSchema: z.ZodEnum<["ar", "en", "fr"]>;
export declare const multilingualTextSchema: z.ZodObject<{
    ar: z.ZodString;
    en: z.ZodString;
    fr: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ar: string;
    en: string;
    fr: string;
}, {
    ar: string;
    en: string;
    fr: string;
}>;
export declare const optionalMultilingualTextSchema: z.ZodObject<{
    ar: z.ZodOptional<z.ZodString>;
    en: z.ZodOptional<z.ZodString>;
    fr: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ar?: string | undefined;
    en?: string | undefined;
    fr?: string | undefined;
}, {
    ar?: string | undefined;
    en?: string | undefined;
    fr?: string | undefined;
}>;
export declare const uuidSchema: z.ZodString;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    pageSize: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    pageSize: number;
}, {
    page?: number | undefined;
    pageSize?: number | undefined;
}>;
export declare const dateSchema: z.ZodDate;
export declare const archiveMethodSchema: z.ZodEnum<["WAYBACK", "PDF", "SCREENSHOT", "VIDEO_DOWNLOAD", "MANUAL"]>;
//# sourceMappingURL=validation.d.ts.map