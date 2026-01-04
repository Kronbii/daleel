/**
 * Electoral center data fetching utilities
 * Fetches from backend API instead of direct database access
 */

import { getCenters } from "../api-client";

export async function getCentersList() {
  return getCenters();
}

export async function getCentersByDistrict(districtId: string) {
  return getCenters({ districtId });
}

