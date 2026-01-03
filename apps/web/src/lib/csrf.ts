/**
 * CSRF protection for admin actions
 */

import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const CSRF_TOKEN_NAME = "csrf-token";
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export async function generateCSRFToken(): Promise<string> {
  const token = randomBytes(32).toString("hex");

  // Set in cookie (httpOnly, secure in production)
  // In Next.js 16, cookies() returns a Promise
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: CSRF_TOKEN_EXPIRY / 1000,
    path: "/",
  });

  return token;
}

export async function validateCSRFToken(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  // In Next.js 16, cookies() returns a Promise
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  if (!cookieToken || cookieToken !== token) {
    return false;
  }

  return true;
}

export async function getCSRFToken(): Promise<string | null> {
  // In Next.js 16, cookies() returns a Promise
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value ?? null;
}

