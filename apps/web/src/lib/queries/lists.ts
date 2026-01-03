/**
 * Electoral list data fetching utilities
 */

import { prisma } from "@daleel/db";
import type { Locale } from "@daleel/core";

export async function getListsList() {
  return prisma.electoralList.findMany({
    take: 100,
    orderBy: { nameAr: "asc" },
    include: {
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
  });
}

export async function getListById(id: string) {
  return prisma.electoralList.findUnique({
    where: { id },
    include: {
      district: {
        include: {
          cycle: {
            select: {
              id: true,
              name: true,
              year: true,
            },
          },
        },
      },
      candidates: {
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
        orderBy: { fullNameAr: "asc" },
      },
      cycle: {
        select: {
          id: true,
          name: true,
          year: true,
        },
      },
    },
  });
}

