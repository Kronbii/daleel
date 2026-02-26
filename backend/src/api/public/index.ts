/**
 * Public API routes index
 */

import { handleCycles } from "./cycles";
import { handleDistricts } from "./districts";
import { handleLists } from "./lists";
import { handleCandidates } from "./candidates";
import { handleCenters } from "./centers";
import { handleParties } from "./parties";

export async function handlePublicRoutes(req: Request, pathSegments: string[]): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathSegments[0] === "cycles") {
    return handleCycles(req);
  }

  if (pathSegments[0] === "districts") {
    return handleDistricts(req, pathSegments.slice(1));
  }

  if (pathSegments[0] === "lists") {
    return handleLists(req, pathSegments.slice(1));
  }

  if (pathSegments[0] === "candidates") {
    return handleCandidates(req, pathSegments.slice(1));
  }

  if (pathSegments[0] === "centers") {
    return handleCenters(req);
  }

  if (pathSegments[0] === "parties") {
    return handleParties(req, pathSegments.slice(1));
  }

  return new Response(
    JSON.stringify({ success: false, error: "Not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } }
  );
}
