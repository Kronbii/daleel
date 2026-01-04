"use client";

import { useState } from "react";
import { SearchFilter } from "./search-filter";
import { CustomSelect } from "@/components/ui/custom-select";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";

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
          <span className="hidden xs:inline">{getContent("Filter Lists", "تصفية اللوائح", "Filtrer les listes")}</span>
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
              "Search for a list...",
              "ابحث عن لائحة...",
              "Rechercher une liste..."
            )}
          />
        </div>

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
      </div>
    </div>
  );
}
