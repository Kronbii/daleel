/**
 * Public API: Get electoral centers
 * GET only
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import { handleApiError } from "../../lib/api-utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const districtId = req.query.districtId as string | undefined;

    const centers = await prisma.electoralCenter.findMany({
      where: districtId ? { districtId } : undefined,
      orderBy: { nameAr: "asc" },
      select: {
        id: true,
        districtId: true,
        nameAr: true,
        nameEn: true,
        nameFr: true,
        latitude: true,
        longitude: true,
        addressAr: true,
        addressEn: true,
        addressFr: true,
        notes: true,
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

    return res.json({ data: centers });
  } catch (error) {
    return handleApiError(res, error);
  }
});

export default router;

