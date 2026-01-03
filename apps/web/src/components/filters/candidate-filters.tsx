"use client";

import { useState, useMemo } from "react";
import { SearchFilter } from "./search-filter";
import { CustomSelect } from "@/components/ui/custom-select";
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

  // Prepare district options
  const districtOptions = [
    { value: "", label: getContent("All Districts", "جميع الدوائر", "Toutes les circonscriptions") },
    ...districts.map((district) => ({
      value: district.id,
      label: getLocalized({
        ar: district.nameAr,
        en: district.nameEn,
        fr: district.nameFr,
      }, locale),
    })),
  ];

  // Prepare list options
  const listOptions = [
    { value: "", label: getContent("All Lists", "جميع اللوائح", "Toutes les listes") },
    ...filteredLists.map((list) => ({
      value: list.id,
      label: getLocalized({
        ar: list.nameAr,
        en: list.nameEn,
        fr: list.nameFr,
      }, locale),
    })),
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm overflow-visible relative" style={{ zIndex: 10 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 sm:gap-2.5 text-sm sm:text-base">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
          </div>
          <span className="hidden xs:inline">{getContent("Filter Candidates", "تصفية المرشحين", "Filtrer les candidats")}</span>
          <span className="xs:hidden">{getContent("Filters", "تصفية", "Filtres")}</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 sm:gap-1.5 transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-emerald-50 active:bg-emerald-100"
          >
            <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">{getContent("Clear all", "مسح الكل", "Tout effacer")}</span>
            <span className="sm:hidden">{getContent("Clear", "مسح", "Effacer")}</span>
          </button>
        )}
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search-filter"
            className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2"
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

        {/* Filters - Stack on mobile */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {/* District Filter */}
          <div>
            <label
              htmlFor="district-filter"
              className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2"
            >
              {getContent("District", "الدائرة", "Circonscription")}
            </label>
            <CustomSelect
              id="district-filter"
              options={districtOptions}
              value={selectedDistrict}
              onChange={handleDistrictChange}
              placeholder={getContent("Select district", "اختر الدائرة", "Sélectionner")}
            />
          </div>

          {/* List Filter */}
          <div>
            <label
              htmlFor="list-filter"
              className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2"
            >
              {getContent("Electoral List", "اللائحة", "Liste")}
            </label>
            <CustomSelect
              id="list-filter"
              options={listOptions}
              value={selectedList}
              onChange={handleListChange}
              placeholder={getContent("Select list", "اختر اللائحة", "Sélectionner")}
              disabled={!selectedDistrict && districts.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
