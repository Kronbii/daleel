/**
 * Districts index page
 */

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import Link from "next/link";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { prisma } from "@daleel/db";

async function DistrictsList({ locale }: { locale: Locale }) {
  const districts = await prisma.district.findMany({
    take: 50,
    orderBy: { nameAr: "asc" },
    include: {
      cycle: {
        select: {
          id: true,
          name: true,
          year: true,
        },
      },
      _count: {
        select: {
          candidates: true,
          lists: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {districts.map((district) => (
        <Link key={district.id} href={`/${locale}/districts/${district.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
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
                {district.cycle.year} • {district.seatCount} seats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {district._count.candidates} candidates • {district._count.lists} lists
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function DistrictsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Districts</h1>
        <Suspense fallback={<div>Loading districts...</div>}>
          <DistrictsList locale={locale as Locale} />
        </Suspense>
      </main>
    </div>
  );
}

