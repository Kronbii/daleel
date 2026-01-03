/**
 * Prisma middleware for enforcing append-only rules
 * 
 * Security: Prevents deletion and direct updates to immutable models.
 * Instead, create new records or use versioning system.
 */

import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

// Models that are IMMUTABLE after creation (append-only)
const IMMUTABLE_MODELS = [
  "Statement",
  "Affiliation",
  "Source", // Sources can be created but not deleted/updated after creation
  "AuditLog",
  "ProfileVersion",
] as const;

/**
 * Middleware that enforces append-only rules
 */
export function createAppendOnlyMiddleware(prisma: PrismaClient) {
  prisma.$use(async (params, next) => {
    // Block DELETE operations on immutable models
    if (params.action === "delete" || params.action === "deleteMany") {
      if (IMMUTABLE_MODELS.includes(params.model as any)) {
        throw new Error(
          `Cannot delete ${params.model}: This model is append-only and immutable. ` +
            `Use versioning or create a new record instead.`
        );
      }
    }

    // Block UPDATE operations on immutable models
    // Exception: Source can be updated for metadata (but not core archive fields)
    if (params.action === "update" || params.action === "updateMany") {
      if (IMMUTABLE_MODELS.includes(params.model as any)) {
        if (params.model === "Source") {
          // Allow updates to Source but validate that archive fields are not changed
          if (params.args?.data) {
            const restrictedFields = ["archivedUrl", "archivedAt", "archiveMethod", "originalUrl"];
            const hasRestrictedChange = restrictedFields.some(
              (field) => field in params.args.data
            );
            if (hasRestrictedChange) {
              throw new Error(
                "Cannot update Source archive fields (archivedUrl, archivedAt, archiveMethod, originalUrl): " +
                  "Source archive data is immutable. Create a new Source instead."
              );
            }
          }
          // Allow other Source metadata updates
        } else {
          throw new Error(
            `Cannot update ${params.model}: This model is append-only and immutable. ` +
              `Create a new record or use the versioning system instead.`
          );
        }
      }
    }

    return next(params);
  });
}

