/**
 * Electoral center data fetching utilities
 */

import { prisma } from "@daleel/db";

export async function getCentersList() {
  return prisma.electoralCenter.findMany({
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
    },
  });
}

export async function getCentersByDistrict(districtId: string) {
  return prisma.electoralCenter.findMany({
    where: { districtId },
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
    },
  });
}

