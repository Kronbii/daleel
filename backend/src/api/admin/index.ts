/**
 * Admin API routes index
 */

import { Router } from "express";
import sourcesRouter from "./sources.js";

const router = Router();

router.use("/sources", sourcesRouter);

export default router;

