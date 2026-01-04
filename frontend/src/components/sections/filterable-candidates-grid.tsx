"use client";

import { useMemo } from "react";
import { CandidatesGrid } from "./candidates-grid";
import type { Locale } from "@daleel/shared";

interface Candidate {
  id: string;
  slug: string;
  fullNameAr: string;
  fullNameEn: string;
  fullNameFr: string;
  status: string;
  placeholderPhotoStyle: string;
  district?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameFr: string;
  } | null;
  currentList?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameFr: string;
  } | null;
}

interface FilterableCandidatesGridProps {
  candidates: Candidate[];
  locale: Locale;
  filters?: {
    districtId?: string;
    listId?: string;
    search?: string;
  };
  emptyMessage?: string;
}

export function FilterableCandidatesGrid({
  candidates,
  locale,
  filters = {},
  emptyMessage,
}: FilterableCandidatesGridProps) {
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates];

    if (filters.districtId) {
      filtered = filtered.filter(
        (candidate) => candidate.district?.id === filters.districtId
      );
    }

    if (filters.listId) {
      filtered = filtered.filter(
        (candidate) => candidate.currentList?.id === filters.listId
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((candidate) => {
        const nameAr = candidate.fullNameAr?.toLowerCase() || "";
        const nameEn = candidate.fullNameEn?.toLowerCase() || "";
        const nameFr = candidate.fullNameFr?.toLowerCase() || "";
        const districtAr = candidate.district?.nameAr?.toLowerCase() || "";
        const districtEn = candidate.district?.nameEn?.toLowerCase() || "";
        const districtFr = candidate.district?.nameFr?.toLowerCase() || "";
        const listAr = candidate.currentList?.nameAr?.toLowerCase() || "";
        const listEn = candidate.currentList?.nameEn?.toLowerCase() || "";
        const listFr = candidate.currentList?.nameFr?.toLowerCase() || "";

        return (
          nameAr.includes(searchLower) ||
          nameEn.includes(searchLower) ||
          nameFr.includes(searchLower) ||
          districtAr.includes(searchLower) ||
          districtEn.includes(searchLower) ||
          districtFr.includes(searchLower) ||
          listAr.includes(searchLower) ||
          listEn.includes(searchLower) ||
          listFr.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [candidates, filters.districtId, filters.listId, filters.search]);

  return (
    <CandidatesGrid
      candidates={filteredCandidates}
      locale={locale}
      emptyMessage={emptyMessage}
    />
  );
}

