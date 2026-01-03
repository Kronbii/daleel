/**
 * Shared API utilities for consistent error handling and responses
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
) {
  return NextResponse.json({
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
  return NextResponse.json(response, { status });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return errorResponse("Validation error", 400, error.errors);
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

  return errorResponse(message, 500);
}

/**
 * Method not allowed response
 */
export function methodNotAllowedResponse() {
  return errorResponse("Method not allowed", 405);
}

