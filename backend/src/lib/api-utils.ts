/**
 * Shared API utilities for consistent error handling and responses
 */

import { ZodError } from "zod";

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200, headers?: HeadersInit): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json");
  return new Response(
    JSON.stringify({ success: true, data }),
    { status, headers: responseHeaders }
  );
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  headers?: HeadersInit
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json");
  return new Response(
    JSON.stringify({
      success: true,
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }),
    { status: 200, headers: responseHeaders }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown,
  headers?: HeadersInit
): Response {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json");
  const response: { success: false; error: string; details?: unknown } = {
    success: false,
    error,
  };
  if (details) {
    response.details = details;
  }
  return new Response(
    JSON.stringify(response),
    { status, headers: responseHeaders }
  );
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown, headers?: HeadersInit): Response {
  if (error instanceof ZodError) {
    return errorResponse("Validation error", 400, error.errors, headers);
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

  return errorResponse(message, 500, undefined, headers);
}

/**
 * Method not allowed response
 */
export function methodNotAllowedResponse(headers?: HeadersInit): Response {
  return errorResponse("Method not allowed", 405, undefined, headers);
}
