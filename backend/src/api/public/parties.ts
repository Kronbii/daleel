/**
 * Public API: Get parties (affiliations with type = "PARTY")
 * GET only
 */

import { prisma } from "../../db";
import { sanitizeSlug } from "../../../../shared/types";
import { successResponse, errorResponse, handleApiError } from "../../lib/api-utils";

export async function handleParties(req: Request, pathSegments: string[]): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    if (pathSegments.length === 0) {
      // GET /api/public/parties — list all parties
      const partyGroups = await prisma.affiliation.groupBy({
        by: ["nameAr", "nameEn", "nameFr"],
        where: { type: "PARTY" },
        _count: { candidateId: true },
        orderBy: { nameAr: "asc" },
      });

      const parties = partyGroups.map((group) => ({
        nameAr: group.nameAr,
        nameEn: group.nameEn,
        nameFr: group.nameFr,
        slug: sanitizeSlug(group.nameEn),
        candidateCount: group._count.candidateId,
      }));

      return successResponse(parties);
    }

    // GET /api/public/parties/:slug — single party with candidates
    const slug = pathSegments[0];

    // Find the party by matching slug against all distinct party names
    const distinctParties = await prisma.affiliation.findMany({
      where: { type: "PARTY" },
      distinct: ["nameEn"],
      select: { nameAr: true, nameEn: true, nameFr: true },
    });

    const party = distinctParties.find(
      (p) => sanitizeSlug(p.nameEn) === slug
    );

    if (!party) {
      return errorResponse("Not found", 404);
    }

    // Get candidates affiliated with this party
    const candidates = await prisma.candidate.findMany({
      where: {
        affiliations: {
          some: { type: "PARTY", nameEn: party.nameEn },
        },
      },
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
      },
    });

    return successResponse({
      nameAr: party.nameAr,
      nameEn: party.nameEn,
      nameFr: party.nameFr,
      slug,
      candidateCount: candidates.length,
      candidates,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
