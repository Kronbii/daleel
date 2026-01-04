/**
 * Public API: Get electoral centers
 * GET only
 */

import { prisma } from "../../db";
import { successResponse, handleApiError } from "../../lib/api-utils";

export async function handleCenters(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    const districtId = url.searchParams.get("districtId") || undefined;

    const centers = await prisma.electoralCenter.findMany({
      where: districtId ? { districtId } : undefined,
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        districtId: true,
        nameAr: true,
        nameEn: true,
        nameFr: true,
        latitude: true,
        longitude: true,
        addressAr: true,
        addressEn: true,
        addressFr: true,
        notes: true,
        district: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
          },
        },
      },
    });

    return successResponse(centers);
  } catch (error) {
    return handleApiError(error);
  }
}
