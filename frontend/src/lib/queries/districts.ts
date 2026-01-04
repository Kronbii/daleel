/**
 * District data fetching utilities
 * Fetches from backend API instead of direct database access
 */

import { getDistricts, getDistrictById as getDistrictByIdApi } from "../api-client";

export async function getDistrictsList() {
  const response = await getDistricts({ pageSize: 100 });
  return response.data;
}

export async function getDistrictById(id: string) {
  return getDistrictByIdApi(id);
}

