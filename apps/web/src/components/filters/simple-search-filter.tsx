"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{title || defaultTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={placeholder || defaultPlaceholder}
        />
      </CardContent>
    </Card>
  );
}

