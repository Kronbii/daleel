/**
 * Audit logging utilities
 */

import { prisma } from "../db";
import type { AuditAction } from "@prisma/client";

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

export function getClientInfo(req: Request): { ip?: string; userAgent?: string } {
  const forwarded = req.headers.get("x-forwarded-for");
  const forwardedStr = forwarded ? forwarded.split(",")[0].trim() : null;
  const ip = forwardedStr || req.headers.get("x-real-ip") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;
  return { ip, userAgent };
}
