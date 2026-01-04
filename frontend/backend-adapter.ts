/**
 * Backend Adapter for Vercel Serverless Functions
 * Bridges Next.js API routes to backend handlers
 */

import type { NextRequest } from "next/server";
import { handleApiRequest } from "../backend/src/api/router";

export async function handleRequest(req: NextRequest): Promise<Response> {
  return handleApiRequest(req);
}
