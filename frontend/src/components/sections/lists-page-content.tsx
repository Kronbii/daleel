"use client";

import { useState } from "react";
import { ListFilters } from "@/components/filters/list-filters";
import { FilterableListsList } from "./filterable-lists-list";
import type { Locale } from "@daleel/shared";
import { useLocale } from "next-intl";

interface ElectoralList {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  status: string;
  district: {
    id: string;
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };
  _count: {
    candidates: number;
  };
}

interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

interface ListsPageContentProps {
  lists: ElectoralList[];
  districts: District[];
  locale: Locale;
}

export function ListsPageContent({ lists, districts, locale }: ListsPageContentProps) {
  const [filters, setFilters] = useState<{ search?: string; districtId?: string }>({});
  const currentLocale = useLocale();

  const emptyMessage =
    currentLocale === "ar"
      ? "لا توجد لوائح"
      : currentLocale === "fr"
        ? "Aucune liste"
        : "No lists found";

  return (
    <>
      <ListFilters districts={districts} onFilterChange={setFilters} locale={locale} />
      <FilterableListsList
        lists={lists}
        locale={locale}
        searchQuery={filters.search}
        districtFilter={filters.districtId}
        emptyMessage={emptyMessage}
      />
    </>
  );
}

