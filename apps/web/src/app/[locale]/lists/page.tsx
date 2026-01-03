/**
 * Lists index page
 */

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import Link from "next/link";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { prisma } from "@daleel/db";
import { StatusBadge } from "@/components/status-badge";

async function ListsList({ locale }: { locale: Locale }) {
  const lists = await prisma.electoralList.findMany({
    take: 50,
    orderBy: { nameAr: "asc" },
    include: {
      district: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true,
        },
      },
      _count: {
        select: {
          candidates: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <Link key={list.id} href={`/${locale}/lists/${list.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
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
              <CardDescription>
                {getLocalized(list.district, locale)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <StatusBadge status={list.status} />
                <p className="text-sm text-gray-600">{list._count.candidates} candidates</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function ListsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Electoral Lists</h1>
        <Suspense fallback={<div>Loading lists...</div>}>
          <ListsList locale={locale as Locale} />
        </Suspense>
      </main>
    </div>
  );
}

