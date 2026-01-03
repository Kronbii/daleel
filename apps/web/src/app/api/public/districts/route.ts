/**
 * Public API: Get districts
 * GET only
 */

import { NextRequest } from "next/server";
import { prisma } from "@daleel/db";
import { districtQuerySchema } from "@daleel/core";
import { paginatedResponse, handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";
import type { Prisma } from "@daleel/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = districtQuerySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      cycleId: searchParams.get("cycleId") || undefined,
    });

    const where: Prisma.DistrictWhereInput = query.cycleId ? { cycleId: query.cycleId } : {};

    const [districts, total] = await Promise.all([
      prisma.district.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { nameAr: "asc" },
        select: {
          id: true,
          cycleId: true,
          nameAr: true,
          nameEn: true,
          nameFr: true,
          seatCount: true,
          notes: true,
        },
      }),
      prisma.district.count({ where }),
    ]);

    return paginatedResponse(districts, total, query.page, query.pageSize);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  return methodNotAllowedResponse();
}

