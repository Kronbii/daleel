/**
 * Public API: Get election cycles
 * GET only
 */

import { prisma } from "../../db";
import { successResponse, handleApiError } from "../../lib/api-utils";

export async function handleCycles(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const cycles = await prisma.electionCycle.findMany({
      orderBy: { year: "desc" },
      select: {
        id: true,
        name: true,
        year: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(cycles);
  } catch (error) {
    return handleApiError(error);
  }
}
