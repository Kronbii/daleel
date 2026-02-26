/**
 * Party data fetching utilities
 * Fetches from backend API instead of direct database access
 */

import { getParties, getPartyBySlug as getPartyBySlugApi } from "../api-client";

export async function getPartiesList() {
  const response = await getParties();
  return response.data;
}

export async function getPartyBySlug(slug: string) {
  return getPartyBySlugApi(slug);
}
