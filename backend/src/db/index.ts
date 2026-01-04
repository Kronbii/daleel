/**
 * Prisma Client exports and database utilities
 */

import { PrismaClient } from "@prisma/client";
import { createAppendOnlyMiddleware } from "./middleware";

// Prevent multiple instances in serverless (Vercel)
// Use globalThis to reuse Prisma client across serverless function invocations
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Apply append-only middleware only once
if (!globalForPrisma.prisma) {
  createAppendOnlyMiddleware(prisma);
}

// Store in globalThis for serverless reuse (works in both dev and production)
globalForPrisma.prisma = prisma;

// Export Prisma types
export * from "@prisma/client";

