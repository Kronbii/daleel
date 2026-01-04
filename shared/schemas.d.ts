/**
 * Zod schemas for API validation
 */
import { z } from "zod";
export declare const createSourceSchema: z.ZodObject<{
    title: z.ZodString;
    publisher: z.ZodString;
    originalUrl: any;
    archivedUrl: any;
    archivedAt: z.ZodDate;
    archiveMethod: any;
    contentType: z.ZodOptional<z.ZodString>;
    checksum: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    title?: unknown;
    publisher?: unknown;
    originalUrl?: unknown;
    archivedUrl?: unknown;
    archivedAt?: unknown;
    archiveMethod?: unknown;
    contentType?: unknown;
    checksum?: unknown;
    notes?: unknown;
}, {
    [x: string]: any;
    title?: unknown;
    publisher?: unknown;
    originalUrl?: unknown;
    archivedUrl?: unknown;
    archivedAt?: unknown;
    archiveMethod?: unknown;
    contentType?: unknown;
    checksum?: unknown;
    notes?: unknown;
}>;
export declare const createCandidateSchema: z.ZodObject<{
    cycleId: any;
    districtId: any;
    currentListId: any;
    fullNameAr: z.ZodString;
    fullNameEn: z.ZodString;
    fullNameFr: z.ZodString;
    slug: any;
    status: z.ZodDefault<z.ZodEnum<["POTENTIAL", "OFFICIAL", "WITHDRAWN", "DISQUALIFIED"]>>;
    placeholderPhotoStyle: z.ZodDefault<z.ZodEnum<["GEOMETRIC", "INITIALS", "SILHOUETTE"]>>;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    cycleId?: unknown;
    districtId?: unknown;
    currentListId?: unknown;
    fullNameAr?: unknown;
    fullNameEn?: unknown;
    fullNameFr?: unknown;
    slug?: unknown;
    status?: unknown;
    placeholderPhotoStyle?: unknown;
}, {
    [x: string]: any;
    cycleId?: unknown;
    districtId?: unknown;
    currentListId?: unknown;
    fullNameAr?: unknown;
    fullNameEn?: unknown;
    fullNameFr?: unknown;
    slug?: unknown;
    status?: unknown;
    placeholderPhotoStyle?: unknown;
}>;
export declare const updateCandidateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["POTENTIAL", "OFFICIAL", "WITHDRAWN", "DISQUALIFIED"]>;
}, "strip", z.ZodTypeAny, {
    status: "POTENTIAL" | "OFFICIAL" | "WITHDRAWN" | "DISQUALIFIED";
}, {
    status: "POTENTIAL" | "OFFICIAL" | "WITHDRAWN" | "DISQUALIFIED";
}>;
export declare const assignCandidateToListSchema: z.ZodObject<{
    listId: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    listId?: unknown;
}, {
    [x: string]: any;
    listId?: unknown;
}>;
export declare const createAffiliationSchema: z.ZodObject<{
    candidateId: any;
    type: z.ZodEnum<["PARTY", "BLOC", "LIST", "ROLE", "ALLIANCE"]>;
    nameAr: z.ZodString;
    nameEn: z.ZodString;
    nameFr: z.ZodString;
    startDate: z.ZodDate;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodDate>>;
    notes: z.ZodOptional<z.ZodString>;
    sourceId: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    candidateId?: unknown;
    type?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    startDate?: unknown;
    endDate?: unknown;
    notes?: unknown;
    sourceId?: unknown;
}, {
    [x: string]: any;
    candidateId?: unknown;
    type?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    startDate?: unknown;
    endDate?: unknown;
    notes?: unknown;
    sourceId?: unknown;
}>;
export declare const createStatementSchema: z.ZodObject<{
    candidateId: any;
    topicId: any;
    kind: z.ZodEnum<["QUOTE", "INTERVIEW", "VOTE", "PROGRAM", "OTHER"]>;
    summaryAr: z.ZodOptional<z.ZodString>;
    summaryEn: z.ZodOptional<z.ZodString>;
    summaryFr: z.ZodOptional<z.ZodString>;
    occurredAt: z.ZodOptional<z.ZodDate>;
    sourceId: any;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    candidateId?: unknown;
    topicId?: unknown;
    kind?: unknown;
    summaryAr?: unknown;
    summaryEn?: unknown;
    summaryFr?: unknown;
    occurredAt?: unknown;
    sourceId?: unknown;
}, {
    [x: string]: any;
    candidateId?: unknown;
    topicId?: unknown;
    kind?: unknown;
    summaryAr?: unknown;
    summaryEn?: unknown;
    summaryFr?: unknown;
    occurredAt?: unknown;
    sourceId?: unknown;
}>;
export declare const createDistrictSchema: z.ZodObject<{
    cycleId: any;
    nameAr: z.ZodString;
    nameEn: z.ZodString;
    nameFr: z.ZodString;
    seatCount: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    cycleId?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    seatCount?: unknown;
    notes?: unknown;
}, {
    [x: string]: any;
    cycleId?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    seatCount?: unknown;
    notes?: unknown;
}>;
export declare const createElectoralListSchema: z.ZodObject<{
    cycleId: any;
    districtId: any;
    nameAr: z.ZodString;
    nameEn: z.ZodString;
    nameFr: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["DRAFT", "ANNOUNCED", "OFFICIAL", "WITHDRAWN"]>>;
    announcedAt: z.ZodOptional<z.ZodDate>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    cycleId?: unknown;
    districtId?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    status?: unknown;
    announcedAt?: unknown;
    notes?: unknown;
}, {
    [x: string]: any;
    cycleId?: unknown;
    districtId?: unknown;
    nameAr?: unknown;
    nameEn?: unknown;
    nameFr?: unknown;
    status?: unknown;
    announcedAt?: unknown;
    notes?: unknown;
}>;
export declare const approveSubmissionSchema: z.ZodObject<{
    status: z.ZodEnum<["APPROVED", "REJECTED"]>;
    decisionNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "APPROVED" | "REJECTED";
    decisionNotes?: string | undefined;
}, {
    status: "APPROVED" | "REJECTED";
    decisionNotes?: string | undefined;
}>;
export declare const publishReplySchema: z.ZodObject<{
    status: z.ZodEnum<["PUBLISHED", "REJECTED"]>;
    decisionNotes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "REJECTED" | "PUBLISHED";
    decisionNotes?: string | undefined;
}, {
    status: "REJECTED" | "PUBLISHED";
    decisionNotes?: string | undefined;
}>;
export declare const createProfileVersionSchema: z.ZodObject<{
    candidateId: any;
    changeNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    [x: string]: any;
    candidateId?: unknown;
    changeNote?: unknown;
}, {
    [x: string]: any;
    candidateId?: unknown;
    changeNote?: unknown;
}>;
export declare const reviewVersionSchema: z.ZodObject<{
    publishStatus: z.ZodEnum<["REVIEWED", "DRAFT"]>;
}, "strip", z.ZodTypeAny, {
    publishStatus: "DRAFT" | "REVIEWED";
}, {
    publishStatus: "DRAFT" | "REVIEWED";
}>;
export declare const publishVersionSchema: z.ZodObject<{
    publishStatus: z.ZodLiteral<"PUBLISHED">;
}, "strip", z.ZodTypeAny, {
    publishStatus: "PUBLISHED";
}, {
    publishStatus: "PUBLISHED";
}>;
export declare const resolveCorrectionSchema: z.ZodObject<{
    status: z.ZodEnum<["RESOLVED", "REJECTED"]>;
    resolutionNote: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "REJECTED" | "RESOLVED";
    resolutionNote: string;
}, {
    status: "REJECTED" | "RESOLVED";
    resolutionNote: string;
}>;
export declare const candidateQuerySchema: any;
export declare const listQuerySchema: any;
export declare const districtQuerySchema: any;
//# sourceMappingURL=schemas.d.ts.map