"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
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

  if (filteredLists.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage || "No lists found"}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredLists.map((list) => (
        <Link key={list.id} href={`/${locale}/lists/${list.id}`}>
          <Card className="card-hover h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {getLocalized(
                  {
                    ar: list.nameAr,
                    en: list.nameEn,
                    fr: list.nameFr,
                  },
                  locale
                )}
              </CardTitle>
              <CardDescription className="truncate">
                {getLocalized(list.district, locale)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <StatusBadge status={list.status as any} />
                <p className="text-sm text-gray-600">
                  {list._count.candidates}{" "}
                  {locale === "ar" ? "مرشح" : locale === "fr" ? "candidats" : "candidates"}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

