/**
 * Admin authentication and authorization helpers
 */

import { auth } from "./auth";
import type { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null, response: null };
}

export async function requireAdminRole(allowedRoles: UserRole[] = ["ADMIN", "EDITOR"]) {
  const sessionResult = await requireAdminSession();
  if (sessionResult.error) {
    return sessionResult;
  }

  const { session } = sessionResult;
  if (!allowedRoles.includes(session!.user.role)) {
    return {
      error: "Forbidden",
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { session, error: null, response: null };
}

