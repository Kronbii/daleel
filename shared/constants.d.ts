/**
 * Shared constants for Daleel
 */
export declare const SUPPORTED_LOCALES: readonly ["ar", "en", "fr"];
export declare const DEFAULT_LOCALE: "ar";
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export declare const LOCALE_NAMES: Record<Locale, string>;
export declare const PLACEHOLDER_PHOTO_STYLES: readonly ["GEOMETRIC", "INITIALS", "SILHOUETTE"];
export declare const STATUS_COLORS: {
    readonly POTENTIAL: "bg-gray-100 text-gray-800";
    readonly OFFICIAL: "bg-blue-100 text-blue-800";
    readonly WITHDRAWN: "bg-yellow-100 text-yellow-800";
    readonly DISQUALIFIED: "bg-red-100 text-red-800";
    readonly DRAFT: "bg-gray-100 text-gray-800";
    readonly ANNOUNCED: "bg-blue-100 text-blue-800";
    readonly OFFICIAL_LIST: "bg-green-100 text-green-800";
    readonly WITHDRAWN_LIST: "bg-yellow-100 text-yellow-800";
};
export declare const RATE_LIMIT_CONFIG: {
    readonly API_PUBLIC: {
        readonly windowMs: number;
        readonly max: 100;
    };
    readonly API_ADMIN: {
        readonly windowMs: number;
        readonly max: 30;
    };
    readonly AUTH: {
        readonly windowMs: number;
        readonly max: 5;
    };
};
export declare const SECURITY_HEADERS: {
    readonly "X-Frame-Options": "DENY";
    readonly "X-Content-Type-Options": "nosniff";
    readonly "Referrer-Policy": "strict-origin-when-cross-origin";
    readonly "Permissions-Policy": "camera=(), microphone=(), geolocation=(self)";
    readonly "X-DNS-Prefetch-Control": "on";
};
export declare const CSP_BASELINE: string;
//# sourceMappingURL=constants.d.ts.map