/**
 * Shared API utilities for consistent error handling and responses
 */

import type { Response } from "express";
import { ZodError } from "zod";

/**
 * Create a success response
 */
export function successResponse<T>(res: Response, data: T, status: number = 200) {
  return res.status(status).json({ success: true, data });
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return res.json({
    success: true,
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

/**
 * Create an error response
 */
export function errorResponse(
  res: Response,
  error: string,
  status: number = 500,
  details?: unknown
) {
  const response: { success: false; error: string; details?: unknown } = {
    success: false,
    error,
  };
  if (details) {
    response.details = details;
  }
  return res.status(status).json(response);
}

/**
 * Handle API errors consistently
 */
export function handleApiError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return errorResponse(res, "Validation error", 400, error.errors);
  }

  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  // Don't expose internal error details in production
  const message =
    process.env.NODE_ENV === "development" && error instanceof Error
      ? error.message
      : "An error occurred";

  return errorResponse(res, message, 500);
}

/**
 * Method not allowed response
 */
export function methodNotAllowedResponse(res: Response) {
  return errorResponse(res, "Method not allowed", 405);
}

