/**
 * District data fetching utilities
 */

import { prisma } from "@daleel/db";
import type { Locale } from "@daleel/core";

export async function getDistrictsList() {
  return prisma.district.findMany({
    take: 100,
    orderBy: { nameAr: "asc" },
    include: {
      cycle: {
        select: {
          id: true,
          name: true,
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
  });
}

export async function getDistrictById(id: string) {
  return prisma.district.findUnique({
    where: { id },
    include: {
      cycle: {
        select: {
          id: true,
          name: true,
          year: true,
        },
      },
      lists: {
        include: {
          _count: {
            select: {
              candidates: true,
            },
          },
        },
        orderBy: { nameAr: "asc" },
      },
      candidates: {
        include: {
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
    },
  });
}

