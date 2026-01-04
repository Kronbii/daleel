/**
 * Admin API: Create source
 * POST only, requires auth + role
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import { createSourceSchema } from "../../../../shared/schemas.js";
import { RATE_LIMIT_CONFIG } from "../../../../shared/constants.js";
import { logAuditEvent, getClientInfo } from "../../lib/audit.js";
import { rateLimit, getClientIdentifier } from "../../lib/rate-limit.js";
import { validateCSRFToken } from "../../lib/csrf.js";
import { requireRole } from "../../lib/auth.js";
import { successResponse, errorResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

// POST /api/admin/sources - requires ADMIN or EDITOR role
router.post(
  "/",
  requireRole(["ADMIN", "EDITOR"]),
  async (req, res) => {
    try {
      // Rate limiting
      const clientId = getClientIdentifier(req);
      const limit = await rateLimit(
        `admin:${clientId}`,
        RATE_LIMIT_CONFIG.API_ADMIN.windowMs,
        RATE_LIMIT_CONFIG.API_ADMIN.max
      );
      if (!limit.allowed) {
        return errorResponse(res, "Rate limit exceeded", 429);
      }

      // CSRF check
      const csrfToken = req.body.csrfToken;
      if (!validateCSRFToken(req, csrfToken)) {
        return errorResponse(res, "Invalid CSRF token", 403);
      }

      // Validate input
      const validated = createSourceSchema.parse(req.body);

      // Create source
      const source = await prisma.source.create({
        data: validated,
      });

      // Audit log
      const clientInfo = getClientInfo(req);
      await logAuditEvent({
        actorUserId: req.user!.id,
        action: "CREATE",
        entityType: "Source",
        entityId: source.id,
        metadata: { title: source.title },
        ...clientInfo,
      });

      return successResponse(res, source, 201);
    } catch (error) {
      return handleApiError(res, error);
    }
  }
);

export default router;

