"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { SearchFilter } from "./search-filter";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";

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

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          {getContent("Filter Candidates", "تصفية المرشحين", "Filtrer les candidats")}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {getContent("Clear", "مسح", "Effacer")}
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search-filter"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            {getContent("Search", "البحث", "Recherche")}
          </label>
          <SearchFilter
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={getContent(
              "Search for a candidate...",
              "ابحث عن مرشح...",
              "Rechercher un candidat..."
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* District Filter */}
          <div>
            <label
              htmlFor="district-filter"
              className="block text-sm font-medium text-gray-600 mb-1.5"
            >
              {getContent("District", "الدائرة الانتخابية", "Circonscription")}
            </label>
            <select
              id="district-filter"
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-gray-900 text-sm transition-colors"
            >
              <option value="">
                {getContent("All Districts", "جميع الدوائر", "Toutes les circonscriptions")}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {getLocalized(district, locale)}
                </option>
              ))}
            </select>
          </div>

          {/* List Filter */}
          <div>
            <label
              htmlFor="list-filter"
              className="block text-sm font-medium text-gray-600 mb-1.5"
            >
              {getContent("Electoral List", "القائمة الانتخابية", "Liste électorale")}
            </label>
            <select
              id="list-filter"
              value={selectedList}
              onChange={(e) => handleListChange(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-gray-900 text-sm disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={!selectedDistrict && districts.length > 0}
            >
              <option value="">
                {getContent("All Lists", "جميع القوائم", "Toutes les listes")}
              </option>
              {filteredLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {getLocalized(list, locale)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
