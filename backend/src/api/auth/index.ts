/**
 * Auth API routes
 */

import { Router } from "express";
import { z } from "zod";
import { 
  authenticateUser, 
  createSessionCookie, 
  clearSessionCookie, 
  destroySession,
  getSession 
} from "../../lib/auth.js";
import { rateLimit, getClientIdentifier } from "../../lib/rate-limit.js";
import { generateCSRFToken } from "../../lib/csrf.js";
import { RATE_LIMIT_CONFIG } from "../../../../shared/constants.js";
import { successResponse, errorResponse, handleApiError } from "../../lib/api-utils.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    // Rate limiting for auth
    const clientId = getClientIdentifier(req);
    const limit = await rateLimit(
      `auth:${clientId}`,
      RATE_LIMIT_CONFIG.AUTH.windowMs,
      RATE_LIMIT_CONFIG.AUTH.max
    );
    if (!limit.allowed) {
      return errorResponse(res, "Too many login attempts. Please try again later.", 429);
    }

    const { email, password } = loginSchema.parse(req.body);

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return errorResponse(res, result.error, 401);
    }

    createSessionCookie(res, result.sessionId);

    // Generate CSRF token for the session
    const csrfToken = generateCSRFToken(res);

    return successResponse(res, {
      user: {
        id: result.session.userId,
        email: result.session.email,
        role: result.session.role,
      },
      csrfToken,
    });
  } catch (error) {
    return handleApiError(res, error);
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  destroySession(req);
  clearSessionCookie(res);
  return successResponse(res, { message: "Logged out successfully" });
});

// GET /api/auth/session
router.get("/session", (req, res) => {
  const session = getSession(req);

  if (!session) {
    return errorResponse(res, "Not authenticated", 401);
  }

  return successResponse(res, {
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  });
});

// GET /api/auth/csrf - Get a fresh CSRF token
router.get("/csrf", (req, res) => {
  const session = getSession(req);

  if (!session) {
    return errorResponse(res, "Not authenticated", 401);
  }

  const csrfToken = generateCSRFToken(res);
  return successResponse(res, { csrfToken });
});

export default router;

