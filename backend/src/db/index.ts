/**
 * Prisma Client exports and database utilities
 */

import { PrismaClient } from "@prisma/client";
import { createAppendOnlyMiddleware } from "./middleware.js";

// Prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Apply append-only middleware
if (!globalForPrisma.prisma) {
  createAppendOnlyMiddleware(prisma);
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Export Prisma types
export * from "@prisma/client";

