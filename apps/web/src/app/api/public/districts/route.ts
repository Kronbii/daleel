/**
 * Public API: Get districts
 * GET only
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@daleel/db";
import { districtQuerySchema } from "@daleel/core";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = districtQuerySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      cycleId: searchParams.get("cycleId") || undefined,
    });

    const where = query.cycleId ? { cycleId: query.cycleId } : {};

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

    return NextResponse.json({
      success: true,
      data: districts,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

