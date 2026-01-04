/**
 * Vercel Serverless Function wrapper for Express backend
 * This file allows the Express backend to run as a Vercel serverless function
 * 
 * Vercel will automatically handle routing all /api/* requests to this function
 */

import app from "../backend/src/server.js";

// Export the Express app - Vercel's serverless runtime is compatible with Express
export default app;

