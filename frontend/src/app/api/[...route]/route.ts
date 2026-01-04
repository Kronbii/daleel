/**
 * Catch-all API route handler for backend API
 * Routes all /api/* requests to backend handlers
 * Note: /api/auth/[...nextauth] is handled by NextAuth route handler (Next.js routing precedence)
 */

import { NextRequest, NextResponse } from "next/server";
import { handleBackendRequest } from "../../../../backend-adapter";

export async function GET(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { route: string[] } }
) {
  const path = `/api/${params.route.join("/")}`;
  return handleBackendRequest(request, path);
}

