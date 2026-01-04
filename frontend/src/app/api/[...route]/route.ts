/**
 * Catch-all API route handler for backend API
 * Routes all /api/* requests to backend handlers
 * Note: /api/auth/[...nextauth] is handled by NextAuth route handler (Next.js routing precedence)
 */

import { NextRequest } from "next/server";
import { handleRequest } from "../../../../backend-adapter";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request);
}

