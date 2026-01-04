/**
 * Audit logging utilities
 */

import { prisma } from "../db/index.js";
import type { AuditAction } from "@prisma/client";
import type { Request } from "express";

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
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = forwardedStr ? forwardedStr.split(",")[0].trim() : req.ip;
  const userAgent = req.headers["user-agent"] || undefined;
  return { ip, userAgent };
}

