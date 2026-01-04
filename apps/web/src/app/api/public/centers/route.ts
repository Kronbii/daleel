/**
 * Public API: Get electoral centers
 * GET only
 */

import { NextRequest } from "next/server";
import { prisma } from "@daleel/db";
import { handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";
import type { Prisma } from "@daleel/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const districtId = searchParams.get("districtId") || undefined;

    const where: Prisma.ElectoralCenterWhereInput = {};
    if (districtId) where.districtId = districtId;

    const centers = await prisma.electoralCenter.findMany({
      where,
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

