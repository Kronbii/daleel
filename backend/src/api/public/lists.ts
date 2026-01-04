/**
 * Public API: Get electoral lists
 * GET only
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import type { Prisma } from "@prisma/client";
import { listQuerySchema } from "../../../../shared/schemas.js";
import { paginatedResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = listQuerySchema.parse({
      page: req.query.page,
      pageSize: req.query.pageSize,
      cycleId: req.query.cycleId || undefined,
      districtId: req.query.districtId || undefined,
      status: req.query.status || undefined,
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

    return paginatedResponse(res, lists, total, query.page, query.pageSize);
  } catch (error) {
    return handleApiError(res, error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const list = await prisma.electoralList.findUnique({
      where: { id: req.params.id },
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
      return res.status(404).json({ success: false, error: "List not found" });
    }

    return res.json({ success: true, data: list });
  } catch (error) {
    return handleApiError(res, error);
  }
});

export default router;

