/**
 * Electoral list data fetching utilities
 * Fetches from backend API instead of direct database access
 */

import { getLists, getListById as getListByIdApi } from "../api-client";

export async function getListsList() {
  const response = await getLists({ pageSize: 100 });
  return response.data;
}

export async function getListById(id: string) {
  return getListByIdApi(id);
}

