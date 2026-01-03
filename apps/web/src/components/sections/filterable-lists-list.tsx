"use client";

import { useMemo } from "react";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import Link from "next/link";

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

interface FilterableListsListProps {
  lists: ElectoralList[];
  locale: Locale;
  searchQuery?: string;
  districtFilter?: string;
  emptyMessage?: string;
}

export function FilterableListsList({
  lists,
  locale,
  searchQuery = "",
  districtFilter = "",
  emptyMessage,
}: FilterableListsListProps) {
  const filteredLists = useMemo(() => {
    let filtered = [...lists];

    if (districtFilter) {
      filtered = filtered.filter((list) => list.district?.id === districtFilter);
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((list) => {
        const nameAr = list.nameAr?.toLowerCase() || "";
        const nameEn = list.nameEn?.toLowerCase() || "";
        const nameFr = list.nameFr?.toLowerCase() || "";
        const districtAr = list.district?.nameAr?.toLowerCase() || "";
        const districtEn = list.district?.nameEn?.toLowerCase() || "";
        const districtFr = list.district?.nameFr?.toLowerCase() || "";

        return (
          nameAr.includes(searchLower) ||
          nameEn.includes(searchLower) ||
          nameFr.includes(searchLower) ||
          districtAr.includes(searchLower) ||
          districtEn.includes(searchLower) ||
          districtFr.includes(searchLower)
        );
      });
    }

    return filtered;
  }, [lists, searchQuery, districtFilter]);

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  if (filteredLists.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <p className="text-gray-500">{emptyMessage || "No lists found"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredLists.map((list) => (
        <Link key={list.id} href={`/${locale}/lists/${list.id}`} className="block group">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 h-full">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                {getLocalized(
                  {
                    ar: list.nameAr,
                    en: list.nameEn,
                    fr: list.nameFr,
                  },
                  locale
                )}
              </h3>
              <StatusBadge status={list.status as any} />
            </div>
            <p className="text-sm text-gray-500 mb-3 truncate">
              {getLocalized(list.district, locale)}
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              {list._count.candidates} {getContent("candidates", "مرشح", "candidats")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
