"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
import { SearchFilter } from "./search-filter";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";

// Simple X icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

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

interface CandidateFiltersProps {
  districts: District[];
  lists: ElectoralList[];
  onFilterChange: (filters: { districtId?: string; listId?: string; search?: string }) => void;
  locale: Locale;
}

export function CandidateFilters({
  districts,
  lists,
  onFilterChange,
  locale,
}: CandidateFiltersProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedList, setSelectedList] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedList(""); // Reset list when district changes
    onFilterChange({
      districtId: districtId || undefined,
      listId: undefined,
      search: searchQuery || undefined,
    });
  };

  const handleListChange = (listId: string) => {
    setSelectedList(listId);
    onFilterChange({
      districtId: selectedDistrict || undefined,
      listId: listId || undefined,
      search: searchQuery || undefined,
    });
  };

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    onFilterChange({
      districtId: selectedDistrict || undefined,
      listId: selectedList || undefined,
      search: search || undefined,
    });
  };

  const clearFilters = () => {
    setSelectedDistrict("");
    setSelectedList("");
    setSearchQuery("");
    onFilterChange({});
  };

  // Filter lists based on selected district
  const filteredLists = useMemo(() => {
    if (!selectedDistrict) return lists;
    return lists.filter(
      (list) => list.districtId === selectedDistrict || list.district?.id === selectedDistrict
    );
  }, [lists, selectedDistrict]);

  const hasActiveFilters = selectedDistrict || selectedList || searchQuery;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {locale === "ar"
              ? "تصفية المرشحين"
              : locale === "fr"
                ? "Filtrer les candidats"
                : "Filter Candidates"}
          </CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <XIcon className="h-4 w-4" />
              {locale === "ar" ? "مسح" : locale === "fr" ? "Effacer" : "Clear"}
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
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
                  ? "ابحث عن مرشح..."
                  : locale === "fr"
                    ? "Rechercher un candidat..."
                    : "Search for a candidate..."
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* District Filter */}
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
              >
                <option value="" className="text-gray-900 bg-white">
                  {locale === "ar"
                    ? "جميع الدوائر"
                    : locale === "fr"
                      ? "Toutes les circonscriptions"
                      : "All Districts"}
                </option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id} className="text-gray-900 bg-white">
                    {getLocalized(district, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* List Filter */}
            <div>
              <label
                htmlFor="list-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {locale === "ar"
                  ? "القائمة الانتخابية"
                  : locale === "fr"
                    ? "Liste électorale"
                    : "Electoral List"}
              </label>
              <select
                id="list-filter"
                value={selectedList}
                onChange={(e) => handleListChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
                disabled={!selectedDistrict && districts.length > 0}
              >
                <option value="" className="text-gray-900 bg-white">
                  {locale === "ar"
                    ? "جميع القوائم"
                    : locale === "fr"
                      ? "Toutes les listes"
                      : "All Lists"}
                </option>
                {filteredLists.map((list) => (
                  <option key={list.id} value={list.id} className="text-gray-900 bg-white">
                    {getLocalized(list, locale)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
