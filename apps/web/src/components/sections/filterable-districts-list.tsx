"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
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

  if (filteredDistricts.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage || "No districts found"}</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredDistricts.map((district) => (
        <Link key={district.id} href={`/${locale}/districts/${district.id}`}>
          <Card className="card-hover h-full">
            <CardHeader>
              <CardTitle className="text-lg">
                {getLocalized(
                  {
                    ar: district.nameAr,
                    en: district.nameEn,
                    fr: district.nameFr,
                  },
                  locale
                )}
              </CardTitle>
              <CardDescription>
                {district.cycle.year} • {district.seatCount}{" "}
                {locale === "ar" ? "مقعد" : locale === "fr" ? "sièges" : "seats"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {district._count.candidates}{" "}
                {locale === "ar" ? "مرشح" : locale === "fr" ? "candidats" : "candidates"} • {district._count.lists}{" "}
                {locale === "ar" ? "قائمة" : locale === "fr" ? "listes" : "lists"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

