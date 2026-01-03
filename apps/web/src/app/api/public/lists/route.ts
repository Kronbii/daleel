/**
 * Public API: Get electoral lists
 * GET only
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@daleel/db";
import { listQuerySchema } from "@daleel/core";

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

    const where: any = {};
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

    return NextResponse.json({
      success: true,
      data: lists,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch lists" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

