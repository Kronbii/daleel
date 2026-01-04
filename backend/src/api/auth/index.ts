/**
 * Auth API routes
 */

import { z } from "zod";
import { 
  authenticateUser, 
  createSessionCookie, 
  clearSessionCookie, 
  destroySession,
  getSession 
} from "../../lib/auth";
import { rateLimit, getClientIdentifier } from "../../lib/rate-limit";
import { generateCSRFToken } from "../../lib/csrf";
import { RATE_LIMIT_CONFIG } from "../../../../shared/constants";
import { successResponse, errorResponse, handleApiError } from "../../lib/api-utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function handleAuthRoutes(req: Request, pathSegments: string[]): Promise<Response> {
  const route = pathSegments[0];

  if (route === "login" && req.method === "POST") {
    try {
      // Rate limiting for auth
      const clientId = getClientIdentifier(req);
      const limit = await rateLimit(
        `auth:${clientId}`,
        RATE_LIMIT_CONFIG.AUTH.windowMs,
        RATE_LIMIT_CONFIG.AUTH.max
      );
      if (!limit.allowed) {
        return errorResponse("Too many login attempts. Please try again later.", 429);
      }

      const body = await req.json();
      const { email, password } = loginSchema.parse(body);

      const result = await authenticateUser(email, password);

      if (!result.success) {
        return errorResponse(result.error, 401);
      }

      const headers = new Headers();
      createSessionCookie(headers, result.sessionId);

      // Generate CSRF token for the session
      const csrfToken = generateCSRFToken(headers);

      return successResponse({
        user: {
          id: result.session.userId,
          email: result.session.email,
          role: result.session.role,
        },
        csrfToken,
      }, 200, headers);
    } catch (error) {
      return handleApiError(error);
    }
  }

  if (route === "logout" && req.method === "POST") {
    destroySession(req);
    const headers = new Headers();
    clearSessionCookie(headers);
    return successResponse({ message: "Logged out successfully" }, 200, headers);
  }

  if (route === "session" && req.method === "GET") {
    const session = getSession(req);

    if (!session) {
      return errorResponse("Not authenticated", 401);
    }

    return successResponse({
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
    });
  }

  if (route === "csrf" && req.method === "GET") {
    const session = getSession(req);

    if (!session) {
      return errorResponse("Not authenticated", 401);
    }

    const headers = new Headers();
    const csrfToken = generateCSRFToken(headers);
    return successResponse({ csrfToken }, 200, headers);
  }

  return new Response(
    JSON.stringify({ success: false, error: "Not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}
