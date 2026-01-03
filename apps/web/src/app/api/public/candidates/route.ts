/**
 * Public API: Get candidates
 * GET only
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@daleel/db";
import { candidateQuerySchema } from "@daleel/core";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = candidateQuerySchema.parse({
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      cycleId: searchParams.get("cycleId") || undefined,
      districtId: searchParams.get("districtId") || undefined,
      listId: searchParams.get("listId") || undefined,
      status: searchParams.get("status") || undefined,
      q: searchParams.get("q") || undefined,
    });

    const where: any = {};
    if (query.cycleId) where.cycleId = query.cycleId;
    if (query.districtId) where.districtId = query.districtId;
    if (query.listId) where.currentListId = query.listId;
    if (query.status) where.status = query.status;
    if (query.q) {
      where.OR = [
        { fullNameAr: { contains: query.q, mode: "insensitive" } },
        { fullNameEn: { contains: query.q, mode: "insensitive" } },
        { fullNameFr: { contains: query.q, mode: "insensitive" } },
        { slug: { contains: query.q, mode: "insensitive" } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { fullNameAr: "asc" },
        select: {
          id: true,
          slug: true,
          fullNameAr: true,
          fullNameEn: true,
          fullNameFr: true,
          status: true,
          placeholderPhotoStyle: true,
          district: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              nameFr: true,
            },
          },
          currentList: {
            select: {
              id: true,
              nameAr: true,
              nameEn: true,
              nameFr: true,
            },
          },
          updatedAt: true,
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: candidates,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

