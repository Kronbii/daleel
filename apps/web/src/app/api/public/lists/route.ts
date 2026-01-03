/**
 * Public API: Get electoral lists
 * GET only
 */

import { NextRequest } from "next/server";
import { prisma } from "@daleel/db";
import { listQuerySchema } from "@daleel/core";
import { paginatedResponse, handleApiError, methodNotAllowedResponse } from "@/lib/api-utils";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = listQuerySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      cycleId: searchParams.get("cycleId") || undefined,
      districtId: searchParams.get("districtId") || undefined,
      status: searchParams.get("status") || undefined,
    });

    const where: Prisma.ElectoralListWhereInput = {};
    if (query.cycleId) where.cycleId = query.cycleId;
    if (query.districtId) where.districtId = query.districtId;
    if (query.status) where.status = query.status;

    const [lists, total] = await Promise.all([
      prisma.electoralList.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { nameAr: "asc" },
        select: {
          id: true,
          cycleId: true,
          districtId: true,
          nameAr: true,
          nameEn: true,
          nameFr: true,
          status: true,
          announcedAt: true,
          notes: true,
          district: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              nameFr: true,
            },
          },
          _count: {
            select: {
              candidates: true,
            },
          },
        },
      }),
      prisma.electoralList.count({ where }),
    ]);

    return paginatedResponse(lists, total, query.page, query.pageSize);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST() {
  return methodNotAllowedResponse();
}

