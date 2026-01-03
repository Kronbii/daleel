/**
 * Admin API: Create source
 * POST only, requires auth + role
 */

import { NextRequest } from "next/server";
import { requireAdminRole } from "@/lib/admin-auth";
import { createSourceSchema } from "@daleel/core";
import { prisma } from "@daleel/db";
import { logAuditEvent, getClientInfo } from "@/lib/audit";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { RATE_LIMIT_CONFIG } from "@daleel/core";
import { validateCSRFToken } from "@/lib/csrf";
import { successResponse, errorResponse, handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const limit = await rateLimit(
      `admin:${clientId}`,
      RATE_LIMIT_CONFIG.API_ADMIN.windowMs,
      RATE_LIMIT_CONFIG.API_ADMIN.max
    );
    if (!limit.allowed) {
      return errorResponse("Rate limit exceeded", 429);
    }

    // Auth check
    const authResult = await requireAdminRole(["ADMIN", "EDITOR"]);
    if (authResult.error) {
      return authResult.response!;
    }
    const { session } = authResult;

    // CSRF check
    const body = await request.json();
    const csrfToken = body.csrfToken;
    if (!(await validateCSRFToken(csrfToken))) {
      return errorResponse("Invalid CSRF token", 403);
    }

    // Validate input
    const validated = createSourceSchema.parse(body);

    // Create source
    const source = await prisma.source.create({
      data: validated,
    });

    // Audit log
    const clientInfo = getClientInfo(request);
    await logAuditEvent({
      actorUserId: session!.user.id,
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

export async function GET() {
  return methodNotAllowedResponse();
}

