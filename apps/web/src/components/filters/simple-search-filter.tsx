"use client";

import { SearchFilter } from "./search-filter";
import { useLocale } from "next-intl";

interface SimpleSearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  title?: string;
  placeholder?: string;
}

export function SimpleSearchFilter({
  searchQuery,
  onSearchChange,
  title,
  placeholder,
}: SimpleSearchFilterProps) {
  const locale = useLocale();

  const defaultTitle =
    locale === "ar"
      ? "البحث"
      : locale === "fr"
        ? "Recherche"
        : "Search";

  const defaultPlaceholder =
    locale === "ar"
      ? "ابحث..."
      : locale === "fr"
        ? "Rechercher..."
        : "Search...";

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-5 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        {title || defaultTitle}
      </h3>
      <SearchFilter
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={placeholder || defaultPlaceholder}
      />
    </div>
  );
}
