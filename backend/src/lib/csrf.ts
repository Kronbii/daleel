/**
 * CSRF protection for admin actions
 */

import { randomBytes } from "crypto";
import type { Request, Response } from "express";
import cookie from "cookie";

const CSRF_TOKEN_NAME = "csrf-token";
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export function generateCSRFToken(res: Response): string {
  const token = randomBytes(32).toString("hex");

  // Set in cookie (httpOnly, secure in production)
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(CSRF_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: CSRF_TOKEN_EXPIRY / 1000,
      path: "/",
    })
  );

  return token;
}

export function validateCSRFToken(req: Request, token: string | null | undefined): boolean {
  if (!token) {
    return false;
  }

  const cookies = cookie.parse(req.headers.cookie || "");
  const cookieToken = cookies[CSRF_TOKEN_NAME];
  
  if (!cookieToken || cookieToken !== token) {
    return false;
  }

  return true;
}

export function getCSRFToken(req: Request): string | null {
  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies[CSRF_TOKEN_NAME] ?? null;
}

