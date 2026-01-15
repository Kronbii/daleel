"use client";

import { useMemo } from "react";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";
import Link from "next/link";

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

interface FilterableDistrictsListProps {
  districts: District[];
  locale: Locale;
  searchQuery?: string;
  emptyMessage?: string;
}

export function FilterableDistrictsList({
  districts,
  locale,
  searchQuery = "",
  emptyMessage,
}: FilterableDistrictsListProps) {
  const filteredDistricts = useMemo(() => {
    if (!searchQuery) return districts;

    const searchLower = searchQuery.toLowerCase();
    return districts.filter((district) => {
      const nameAr = district.nameAr?.toLowerCase() || "";
      const nameEn = district.nameEn?.toLowerCase() || "";
      const nameFr = district.nameFr?.toLowerCase() || "";
      const year = district.cycle?.year?.toString() || "";

      return (
        nameAr.includes(searchLower) ||
        nameEn.includes(searchLower) ||
        nameFr.includes(searchLower) ||
        year.includes(searchLower)
      );
    });
  }, [districts, searchQuery]);

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  if (filteredDistricts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <p className="text-gray-500 text-sm sm:text-base">{emptyMessage || "No districts found"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDistricts.map((district) => (
        <Link key={district.id} href={`/${locale}/districts/${district.id}`} className="block group">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-3 sm:p-5 transition-all duration-300 hover:shadow-md hover:border-cedar/20 active:scale-[0.98] h-full shadow-sm">
            <h3 className="font-medium text-gray-900 group-hover:text-cedar transition-colors mb-1 sm:mb-2 text-sm sm:text-base">
              {getLocalized(
                {
                  ar: district.nameAr,
                  en: district.nameEn,
                  fr: district.nameFr,
                },
                locale
              )}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
              {district.cycle?.year} • {district.seatCount}{" "}
              {getContent("seats", "مقعد", "sièges")}
            </p>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {district._count.candidates}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {district._count.lists}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
