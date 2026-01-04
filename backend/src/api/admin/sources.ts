/**
 * Admin API: Create source
 * POST only, requires auth + role
 */

import { prisma } from "../../db";
import type { ArchiveMethod } from "@prisma/client";
import { createSourceSchema } from "../../../../shared/schemas";
import { RATE_LIMIT_CONFIG } from "../../../../shared/constants";
import { logAuditEvent, getClientInfo } from "../../lib/audit";
import { rateLimit, getClientIdentifier } from "../../lib/rate-limit";
import { validateCSRFToken } from "../../lib/csrf";
import { requireRole, type AuthContext } from "../../lib/auth";
import { successResponse, errorResponse, handleApiError } from "../../lib/api-utils";

export async function handleSources(req: Request, authContext: AuthContext): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const limit = await rateLimit(
      `admin:${clientId}`,
      RATE_LIMIT_CONFIG.API_ADMIN.windowMs,
      RATE_LIMIT_CONFIG.API_ADMIN.max
    );
    if (!limit.allowed) {
      return errorResponse("Rate limit exceeded", 429);
    }

    // Parse body
    const body = await req.json();

    // CSRF check
    const csrfToken = body.csrfToken;
    if (!validateCSRFToken(req, csrfToken)) {
      return errorResponse("Invalid CSRF token", 403);
    }

    // Validate input
    const validated = createSourceSchema.parse(body);

    // Create source
    const source = await prisma.source.create({
      data: {
        title: validated.title,
        publisher: validated.publisher,
        originalUrl: validated.originalUrl,
        archivedUrl: validated.archivedUrl,
        archivedAt: validated.archivedAt,
        archiveMethod: validated.archiveMethod as ArchiveMethod,
        contentType: validated.contentType ?? null,
        checksum: validated.checksum ?? null,
        notes: validated.notes ?? null,
      },
    });

    // Audit log
    const clientInfo = getClientInfo(req);
    await logAuditEvent({
      actorUserId: authContext.user.id,
      action: "CREATE",
      entityType: "Source",
      entityId: source.id,
      metadata: { title: source.title },
      ...clientInfo,
    });

    return successResponse(source, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
