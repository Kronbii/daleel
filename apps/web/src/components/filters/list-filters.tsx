"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
import { SearchFilter } from "./search-filter";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";

interface District {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
}

interface ListFiltersProps {
  districts: District[];
  onFilterChange: (filters: { search?: string; districtId?: string }) => void;
  locale: Locale;
}

export function ListFilters({ districts, onFilterChange, locale }: ListFiltersProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    onFilterChange({ search: search || undefined, districtId: selectedDistrict || undefined });
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    onFilterChange({ search: searchQuery || undefined, districtId: districtId || undefined });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDistrict("");
    onFilterChange({});
  };

  const hasActiveFilters = searchQuery || selectedDistrict;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {locale === "ar"
              ? "تصفية القوائم"
              : locale === "fr"
                ? "Filtrer les listes"
                : "Filter Lists"}
          </CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {locale === "ar" ? "مسح" : locale === "fr" ? "Effacer" : "Clear"}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="search-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {locale === "ar"
                ? "البحث"
                : locale === "fr"
                  ? "Recherche"
                  : "Search"}
            </label>
            <SearchFilter
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={
                locale === "ar"
                  ? "ابحث عن قائمة..."
                  : locale === "fr"
                    ? "Rechercher une liste..."
                    : "Search for a list..."
              }
            />
          </div>

          <div>
            <label
              htmlFor="district-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {locale === "ar"
                ? "الدائرة الانتخابية"
                : locale === "fr"
                  ? "Circonscription"
                  : "District"}
            </label>
            <select
              id="district-filter"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              style={{ color: 'rgb(17, 24, 39)' }}
            >
              <option value="" style={{ color: 'rgb(17, 24, 39)', backgroundColor: 'white' }}>
                {locale === "ar"
                  ? "جميع الدوائر"
                  : locale === "fr"
                    ? "Toutes les circonscriptions"
                    : "All Districts"}
              </option>
              {districts.map((district) => (
                <option
                  key={district.id}
                  value={district.id}
                  style={{ color: 'rgb(17, 24, 39)', backgroundColor: 'white' }}
                >
                  {getLocalized(district, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

