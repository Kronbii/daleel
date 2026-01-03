/**
 * Candidate data fetching utilities
 */

import { prisma } from "@daleel/db";
import type { Locale } from "@daleel/core";

export async function getCandidatesList(locale: Locale) {
  return prisma.candidate.findMany({
    take: 100,
    orderBy: { fullNameAr: "asc" },
    include: {
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
}

export async function getCandidateBySlug(slug: string) {
  return prisma.candidate.findUnique({
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
          topic: {
            select: {
              id: true,
              key: true,
              nameAr: true,
              nameEn: true,
              nameFr: true,
            },
          },
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
}

