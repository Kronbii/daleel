/**
 * Public API: Get electoral centers
 * GET only
 */

import { NextRequest } from "next/server";
import { prisma } from "@daleel/db";
import { handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const districtId = searchParams.get("districtId") || undefined;

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

    return Response.json({ data: centers });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  return methodNotAllowedResponse();
}

