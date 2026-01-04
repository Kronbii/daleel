"use client";

import { useState } from "react";
import { SimpleSearchFilter } from "@/components/filters/simple-search-filter";
import { FilterableDistrictsList } from "./filterable-districts-list";
import type { Locale } from "@daleel/shared";
import { useLocale } from "next-intl";

interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
  cycle: {
    year: number;
  };
  seatCount: number;
  _count: {
    candidates: number;
    lists: number;
  };
}

interface DistrictsPageContentProps {
  districts: District[];
  locale: Locale;
}

export function DistrictsPageContent({ districts, locale }: DistrictsPageContentProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const currentLocale = useLocale();

  const emptyMessage =
    currentLocale === "ar"
      ? "لا توجد دوائر"
      : currentLocale === "fr"
        ? "Aucune circonscription"
        : "No districts found";

  return (
    <>
      <SimpleSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={
          currentLocale === "ar"
            ? "ابحث عن دائرة..."
            : currentLocale === "fr"
              ? "Rechercher une circonscription..."
              : "Search for a district..."
        }
      />
      <FilterableDistrictsList
        districts={districts}
        locale={locale}
        searchQuery={searchQuery}
        emptyMessage={emptyMessage}
      />
    </>
  );
}

