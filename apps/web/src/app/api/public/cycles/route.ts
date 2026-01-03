/**
 * Public API: Get election cycles
 * GET only
 */

import { prisma } from "@daleel/db";
import { successResponse, handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";

export async function GET() {
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

// Block other methods
export async function POST() {
  return methodNotAllowedResponse();
}

