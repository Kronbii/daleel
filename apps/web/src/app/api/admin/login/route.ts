/**
 * Admin login endpoint (handled by NextAuth)
 * This file exists for documentation, actual login is handled by NextAuth
 */

import { NextResponse } from "next/server";

export async function POST() {
  // NextAuth handles login at /api/auth/signin
  return NextResponse.json(
    { error: "Use /api/auth/signin for login" },
    { status: 400 }
  );
}

