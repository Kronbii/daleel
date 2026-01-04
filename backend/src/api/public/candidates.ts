/**
 * Public API: Get candidates
 * GET only
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import type { Prisma } from "@prisma/client";
import { candidateQuerySchema } from "../../../../shared/schemas.js";
import { paginatedResponse, successResponse, errorResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

// GET /api/public/candidates
router.get("/", async (req, res) => {
  try {
    const query = candidateQuerySchema.parse({
      page: req.query.page,
      pageSize: req.query.pageSize,
      cycleId: req.query.cycleId || undefined,
      districtId: req.query.districtId || undefined,
      listId: req.query.listId || undefined,
      status: req.query.status || undefined,
      q: req.query.q || undefined,
    });

    const where: Prisma.CandidateWhereInput = {};
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

    return paginatedResponse(res, candidates, total, query.page, query.pageSize);
  } catch (error) {
    return handleApiError(res, error);
  }
});

// GET /api/public/candidates/:slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const candidate = await prisma.candidate.findUnique({
      where: { slug },
      include: {
        district: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            seatCount: true,
          },
        },
        currentList: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            nameFr: true,
            status: true,
          },
        },
        affiliations: {
          orderBy: { startDate: "desc" },
          include: {
            source: {
              select: {
                id: true,
                title: true,
                archivedUrl: true,
                archivedAt: true,
              },
            },
          },
        },
        statements: {
          include: {
            topic: true,
            source: {
              select: {
                id: true,
                title: true,
                archivedUrl: true,
                archivedAt: true,
              },
            },
          },
          orderBy: { occurredAt: "desc" },
        },
        submissions: {
          where: { status: "APPROVED" },
          orderBy: { submittedAt: "desc" },
        },
        rightOfReplies: {
          where: { status: "PUBLISHED" },
          orderBy: { submittedAt: "desc" },
        },
      },
    });

    if (!candidate) {
      return errorResponse(res, "Not found", 404);
    }

    // Get all sources referenced
    const sourceIds = new Set<string>();
    candidate.affiliations?.forEach((a) => sourceIds.add(a.sourceId));
    candidate.statements?.forEach((s) => sourceIds.add(s.sourceId));

    const sources = await prisma.source.findMany({
      where: { id: { in: Array.from(sourceIds) } },
      select: {
        id: true,
        title: true,
        publisher: true,
        originalUrl: true,
        archivedUrl: true,
        archivedAt: true,
        archiveMethod: true,
        contentType: true,
      },
    });

    return successResponse(res, {
      ...candidate,
      sources,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
});

export default router;

