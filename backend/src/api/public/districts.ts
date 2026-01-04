/**
 * Public API: Get districts
 * GET only
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import type { Prisma } from "@prisma/client";
import { districtQuerySchema } from "../../../../shared/schemas.js";
import { paginatedResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = districtQuerySchema.parse({
      page: req.query.page,
      pageSize: req.query.pageSize,
      cycleId: req.query.cycleId || undefined,
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

    return paginatedResponse(res, districts, total, query.page, query.pageSize);
  } catch (error) {
    return handleApiError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const district = await prisma.district.findUnique({
      where: { id: req.params.id },
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
      return res.status(404).json({ success: false, error: "District not found" });
    }

    return res.json({ success: true, data: district });
  } catch (error) {
    return handleApiError(res, error);
  }
});

export default router;

