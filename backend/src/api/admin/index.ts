/**
 * Admin API routes index
 */

import { handleSources } from "./sources";
import { requireRole, type AuthContext } from "../../lib/auth";

export async function handleAdminRoutes(req: Request, pathSegments: string[]): Promise<Response> {
  // Check auth and role
  const roleCheck = requireRole(["ADMIN", "EDITOR"])(req);
  if (!roleCheck.success) {
    return roleCheck.response;
  }

  const authContext = roleCheck.context;

  if (pathSegments[0] === "sources") {
    return handleSources(req, authContext);
  }

  return new Response(
    JSON.stringify({ success: false, error: "Not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}
