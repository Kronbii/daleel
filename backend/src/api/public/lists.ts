/**
 * Public API: Get electoral lists
 * GET only
 */

import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { listQuerySchema } from "../../../../shared/schemas";
import { paginatedResponse, successResponse, handleApiError } from "../../lib/api-utils";

export async function handleLists(req: Request, pathSegments: string[]): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);

    if (pathSegments.length === 0) {
      const query = listQuerySchema.parse({
        page: url.searchParams.get("page"),
        pageSize: url.searchParams.get("pageSize"),
        cycleId: url.searchParams.get("cycleId") || undefined,
        districtId: url.searchParams.get("districtId") || undefined,
        status: url.searchParams.get("status") || undefined,
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
    }

    const id = pathSegments[0];
    const list = await prisma.electoralList.findUnique({
      where: { id },
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
        cycle: {
          select: {
            year: true,
          },
        },
        district: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            seatCount: true,
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
      },
    });

    if (!list) {
      return new Response(
        JSON.stringify({ success: false, error: "List not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return successResponse(list);
  } catch (error) {
    return handleApiError(error);
  }
}
