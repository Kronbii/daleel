/**
 * Public API routes index
 */

import { Router } from "express";
import cyclesRouter from "./cycles.js";
import districtsRouter from "./districts.js";
import listsRouter from "./lists.js";
import candidatesRouter from "./candidates.js";
import centersRouter from "./centers.js";

const router = Router();

router.use("/cycles", cyclesRouter);
router.use("/districts", districtsRouter);
router.use("/lists", listsRouter);
router.use("/candidates", candidatesRouter);
router.use("/centers", centersRouter);

export default router;

