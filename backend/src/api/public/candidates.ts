/**
 * Public API: Get candidates
 * GET only
 */

import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { candidateQuerySchema } from "../../../../shared/schemas";
import { paginatedResponse, successResponse, errorResponse, handleApiError } from "../../lib/api-utils";

export async function handleCandidates(req: Request, pathSegments: string[]): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(req.url);

    if (pathSegments.length === 0) {
      const query = candidateQuerySchema.parse({
        page: url.searchParams.get("page"),
        pageSize: url.searchParams.get("pageSize"),
        cycleId: url.searchParams.get("cycleId") || undefined,
        districtId: url.searchParams.get("districtId") || undefined,
        listId: url.searchParams.get("listId") || undefined,
        status: url.searchParams.get("status") || undefined,
        q: url.searchParams.get("q") || undefined,
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

      return paginatedResponse(candidates, total, query.page, query.pageSize);
    }

    const slug = pathSegments[0];
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
      return errorResponse("Not found", 404);
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

    return successResponse({
      ...candidate,
      sources,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
