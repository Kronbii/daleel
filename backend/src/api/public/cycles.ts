/**
 * Public API: Get election cycles
 * GET only
 */

import { Router } from "express";
import { prisma } from "../../db/index.js";
import { successResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cycles = await prisma.electionCycle.findMany({
      orderBy: { year: "desc" },
      select: {
        id: true,
        name: true,
        year: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(res, cycles);
  } catch (error) {
    return handleApiError(res, error);
  }
});

export default router;

