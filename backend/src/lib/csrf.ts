/**
 * CSRF protection for admin actions
 */

import { randomBytes } from "crypto";
import cookie from "cookie";

const CSRF_TOKEN_NAME = "csrf-token";
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export function generateCSRFToken(headers: Headers): string {
  const token = randomBytes(32).toString("hex");

  // Set in cookie (httpOnly, secure in production)
  const cookieValue = cookie.serialize(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: "/",
  });

  headers.append("Set-Cookie", cookieValue);

  return token;
}

export function validateCSRFToken(req: Request, token: string | null | undefined): boolean {
  if (!token) {
    return false;
  }

  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const cookieToken = cookies[CSRF_TOKEN_NAME];
  
  if (!cookieToken || cookieToken !== token) {
    return false;
  }

  return true;
}

export function getCSRFToken(req: Request): string | null {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  return cookies[CSRF_TOKEN_NAME] ?? null;
}
