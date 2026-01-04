/**
 * Public API: Get districts
 * GET only
 */

import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { districtQuerySchema } from "../../../../shared/schemas";
import { paginatedResponse, successResponse, handleApiError } from "../../lib/api-utils";

export async function handleDistricts(req: Request, pathSegments: string[]): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);
    
    if (pathSegments.length === 0) {
      const query = districtQuerySchema.parse({
        page: url.searchParams.get("page"),
        pageSize: url.searchParams.get("pageSize"),
        cycleId: url.searchParams.get("cycleId") || undefined,
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
            cycle: {
              select: {
                year: true,
              },
            },
            _count: {
              select: {
                candidates: true,
                lists: true,
              },
            },
          },
        }),
        prisma.district.count({ where }),
      ]);

      return paginatedResponse(districts, total, query.page, query.pageSize);
    }

    const id = pathSegments[0];
    const district = await prisma.district.findUnique({
      where: { id },
      select: {
        id: true,
        cycleId: true,
        nameAr: true,
        nameEn: true,
        nameFr: true,
        seatCount: true,
        notes: true,
        cycle: {
          select: {
            year: true,
          },
        },
        candidates: {
          select: {
            id: true,
            slug: true,
            fullNameAr: true,
            fullNameEn: true,
            fullNameFr: true,
            status: true,
            placeholderPhotoStyle: true,
          },
          orderBy: { fullNameAr: "asc" },
        },
        lists: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            status: true,
            _count: {
              select: {
                candidates: true,
              },
            },
          },
          orderBy: { nameAr: "asc" },
        },
      },
    });

    if (!district) {
      return new Response(
        JSON.stringify({ success: false, error: "District not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return successResponse(district);
  } catch (error) {
    return handleApiError(error);
  }
}
