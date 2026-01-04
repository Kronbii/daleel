/**
 * Candidate data fetching utilities
 * Fetches from backend API instead of direct database access
 */

import { getCandidates, getCandidateBySlug as getCandidateBySlugApi } from "../api-client";
import type { Locale } from "@daleel/shared";

export async function getCandidatesList(locale: Locale) {
  const response = await getCandidates({ pageSize: 100 });
  return response.data;
}

export async function getCandidateBySlug(slug: string) {
  return getCandidateBySlugApi(slug);
}

