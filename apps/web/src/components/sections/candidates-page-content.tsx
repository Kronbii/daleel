"use client";

import { useState } from "react";
import { CandidateFilters } from "@/components/filters/candidate-filters";
import { FilterableCandidatesGrid } from "./filterable-candidates-grid";
import type { Locale } from "@daleel/core";
import { useLocale } from "next-intl";

interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

interface ElectoralList {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  districtId?: string;
  district?: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameFr: string;
  } | null;
}

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

interface CandidatesPageContentProps {
  candidates: Candidate[];
  districts: District[];
  lists: ElectoralList[];
  locale: Locale;
}

export function CandidatesPageContent({
  candidates,
  districts,
  lists,
  locale,
}: CandidatesPageContentProps) {
  const [filters, setFilters] = useState<{
    districtId?: string;
    listId?: string;
    search?: string;
  }>({});
  const currentLocale = useLocale();

  const emptyMessage =
    currentLocale === "ar"
      ? "لا يوجد مرشحون"
      : currentLocale === "fr"
        ? "Aucun candidat"
        : "No candidates found";

  return (
    <>
      <CandidateFilters
        districts={districts}
        lists={lists}
        onFilterChange={setFilters}
        locale={locale}
      />
      <FilterableCandidatesGrid
        candidates={candidates}
        locale={locale}
        filters={filters}
        emptyMessage={emptyMessage}
      />
    </>
  );
}

