/**
 * Pure request handler for Vercel serverless functions
 * Exports a function that handles Web API Request/Response
 */

import { SECURITY_HEADERS } from "../../../shared/constants";
import { handlePublicRoutes } from "./public";
import { handleAdminRoutes } from "./admin";
import { handleAuthRoutes } from "./auth";

/**
 * Pure request handler for Vercel serverless functions
 */
export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Parse path segments
  const segments = pathname.split("/").filter(Boolean);
  
  // Handle health check
  if (pathname === "/health" || pathname === "/api/health") {
    const headers = new Headers();
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      headers.set(key, value);
    });
    headers.set("Content-Type", "application/json");
    return new Response(
      JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }),
      { status: 200, headers }
    );
  }

  // Route to handlers based on path
  if (segments[0] === "api") {
    const routeType = segments[1];
    const routeSegments = segments.slice(2);

    if (routeType === "public") {
      const response = await handlePublicRoutes(req, routeSegments);
      return addSecurityHeaders(response);
    }

    if (routeType === "admin") {
      const response = await handleAdminRoutes(req, routeSegments);
      return addSecurityHeaders(response);
    }

    if (routeType === "auth") {
      const response = await handleAuthRoutes(req, routeSegments);
      return addSecurityHeaders(response);
    }
  }

  // 404
  const headers = new Headers();
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  headers.set("Content-Type", "application/json");
  return new Response(
    JSON.stringify({ success: false, error: "Not found" }),
    { status: 404, headers }
  );
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
