/**
 * Audit logging utilities
 */

import { prisma } from "@daleel/db";
import type { AuditAction } from "@daleel/db";

export async function logAuditEvent(params: {
  actorUserId: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: params.actorUserId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata || {},
        ip: params.ip,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the application
    console.error("Failed to write audit log:", error);
  }
}

export function getClientInfo(request: Request): { ip?: string; userAgent?: string } {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : undefined;
  const userAgent = request.headers.get("user-agent") || undefined;
  return { ip, userAgent };
}

