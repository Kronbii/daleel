/**
 * Zod schemas for API validation
 */

import { z } from "zod";
import {
  urlSchema,
  slugSchema,
  emailSchema,
  localeSchema,
  multilingualTextSchema,
  optionalMultilingualTextSchema,
  uuidSchema,
  paginationSchema,
  archiveMethodSchema,
} from "./validation";

// ============================================================================
// SOURCE SCHEMAS
// ============================================================================

export const createSourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  publisher: z.string().min(1, "Publisher is required").max(200),
  originalUrl: urlSchema,
  archivedUrl: urlSchema, // REQUIRED
  archivedAt: z.coerce.date(), // REQUIRED
  archiveMethod: archiveMethodSchema, // REQUIRED
  contentType: z.string().optional(),
  checksum: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// CANDIDATE SCHEMAS
// ============================================================================

export const createCandidateSchema = z.object({
  cycleId: uuidSchema,
  districtId: uuidSchema,
  currentListId: uuidSchema.optional(),
  fullNameAr: z.string().min(1, "Arabic name is required"),
  fullNameEn: z.string().min(1, "English name is required"),
  fullNameFr: z.string().min(1, "French name is required"),
  slug: slugSchema,
  status: z.enum(["POTENTIAL", "OFFICIAL", "WITHDRAWN", "DISQUALIFIED"]).default("POTENTIAL"),
  placeholderPhotoStyle: z
    .enum(["GEOMETRIC", "INITIALS", "SILHOUETTE"])
    .default("GEOMETRIC"),
});

export const updateCandidateStatusSchema = z.object({
  status: z.enum(["POTENTIAL", "OFFICIAL", "WITHDRAWN", "DISQUALIFIED"]),
});

export const assignCandidateToListSchema = z.object({
  listId: uuidSchema.nullable(),
});

// ============================================================================
// AFFILIATION SCHEMAS
// ============================================================================

export const createAffiliationSchema = z.object({
  candidateId: uuidSchema,
  type: z.enum(["PARTY", "BLOC", "LIST", "ROLE", "ALLIANCE"]),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameFr: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  notes: z.string().optional(),
  sourceId: uuidSchema, // REQUIRED
});

// ============================================================================
// STATEMENT SCHEMAS
// ============================================================================

export const createStatementSchema = z.object({
  candidateId: uuidSchema,
  topicId: uuidSchema,
  kind: z.enum(["QUOTE", "INTERVIEW", "VOTE", "PROGRAM", "OTHER"]),
  summaryAr: z.string().optional(),
  summaryEn: z.string().optional(),
  summaryFr: z.string().optional(),
  occurredAt: z.coerce.date().optional(),
  sourceId: uuidSchema, // REQUIRED
});

// ============================================================================
// ELECTION STRUCTURE SCHEMAS
// ============================================================================

export const createDistrictSchema = z.object({
  cycleId: uuidSchema,
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameFr: z.string().min(1),
  seatCount: z.number().int().min(1),
  notes: z.string().optional(),
});

export const createElectoralListSchema = z.object({
  cycleId: uuidSchema,
  districtId: uuidSchema,
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameFr: z.string().min(1),
  status: z.enum(["DRAFT", "ANNOUNCED", "OFFICIAL", "WITHDRAWN"]).default("DRAFT"),
  announcedAt: z.coerce.date().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// SUBMISSION SCHEMAS
// ============================================================================

export const approveSubmissionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  decisionNotes: z.string().optional(),
});

export const publishReplySchema = z.object({
  status: z.enum(["PUBLISHED", "REJECTED"]),
  decisionNotes: z.string().optional(),
});

// ============================================================================
// VERSIONING SCHEMAS
// ============================================================================

export const createProfileVersionSchema = z.object({
  candidateId: uuidSchema,
  changeNote: z.string().optional(),
});

export const reviewVersionSchema = z.object({
  publishStatus: z.enum(["REVIEWED", "DRAFT"]),
});

export const publishVersionSchema = z.object({
  publishStatus: z.literal("PUBLISHED"),
});

// ============================================================================
// CORRECTION SCHEMAS
// ============================================================================

export const resolveCorrectionSchema = z.object({
  status: z.enum(["RESOLVED", "REJECTED"]),
  resolutionNote: z.string().min(1, "Resolution note is required"),
});

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

export const candidateQuerySchema = paginationSchema.extend({
  cycleId: uuidSchema.optional(),
  districtId: uuidSchema.optional(),
  listId: uuidSchema.optional(),
  status: z.enum(["POTENTIAL", "OFFICIAL", "WITHDRAWN", "DISQUALIFIED"]).optional(),
  q: z.string().optional(), // Search query
});

export const listQuerySchema = paginationSchema.extend({
  cycleId: uuidSchema.optional(),
  districtId: uuidSchema.optional(),
  status: z.enum(["DRAFT", "ANNOUNCED", "OFFICIAL", "WITHDRAWN"]).optional(),
});

export const districtQuerySchema = paginationSchema.extend({
  cycleId: uuidSchema.optional(),
});

