/**
 * Authentication utilities for admin API
 * Implements session-based authentication with JWT tokens
 */

import { prisma } from "../db";
import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";

const { compare, hash } = bcryptjs;
import cookie from "cookie";
import type { UserRole } from "@prisma/client";

// Session store (in production, use Redis)
interface Session {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: number;
}

const sessions = new Map<string, Session>();

const SESSION_COOKIE_NAME = "daleel-session";
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ success: true; session: Session; sessionId: string } | { success: false; error: string }> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.isActive) {
    return { success: false, error: "Invalid credentials" };
  }

  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Invalid credentials" };
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const sessionId = generateSessionId();
  const session: Session = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + SESSION_EXPIRY,
  };

  sessions.set(sessionId, session);

  return { success: true, session, sessionId };
}

export function createSessionCookie(headers: Headers, sessionId: string): void {
  const cookieValue = cookie.serialize(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_EXPIRY / 1000,
    path: "/",
  });
  headers.append("Set-Cookie", cookieValue);
}

export function clearSessionCookie(headers: Headers): void {
  const cookieValue = cookie.serialize(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  headers.append("Set-Cookie", cookieValue);
}

export function getSession(req: Request): Session | null {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export function destroySession(req: Request): void {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    sessions.delete(sessionId);
  }
}

export interface AuthContext {
  session: Session;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export function requireAuth(req: Request): { success: false; response: Response } | { success: true; context: AuthContext } {
  const session = getSession(req);

  if (!session) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return {
    success: true,
    context: {
      session,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
    },
  };
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request): { success: false; response: Response } | { success: true; context: AuthContext } => {
    const session = getSession(req);

    if (!session) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ success: false, error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    if (!allowedRoles.includes(session.role)) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ success: false, error: "Forbidden" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    return {
      success: true,
      context: {
        session,
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
        },
      },
    };
  };
}

// Hash password utility
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 1000); // Every minute
