/**
 * Authentication utilities for admin API
 * Implements session-based authentication with JWT tokens
 */

import { prisma } from "../db/index.js";
import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";

const { compare, hash } = bcryptjs;
import cookie from "cookie";
import type { Request, Response, NextFunction } from "express";
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

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      session?: Session;
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

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

export function createSessionCookie(res: Response, sessionId: string): void {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_EXPIRY / 1000,
      path: "/",
    })
  );
}

export function clearSessionCookie(res: Response): void {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })
  );
}

export function getSession(req: Request): Session | null {
  const cookies = cookie.parse(req.headers.cookie || "");
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
  const cookies = cookie.parse(req.headers.cookie || "");
  const sessionId = cookies[SESSION_COOKIE_NAME];

  if (sessionId) {
    sessions.delete(sessionId);
  }
}

// Middleware to require authentication
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const session = getSession(req);

  if (!session) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  req.session = session;
  req.user = {
    id: session.userId,
    email: session.email,
    role: session.role,
  };

  next();
}

// Middleware to require specific roles
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const session = getSession(req);

    if (!session) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(session.role)) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    req.session = session;
    req.user = {
      id: session.userId,
      email: session.email,
      role: session.role,
    };

    next();
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

