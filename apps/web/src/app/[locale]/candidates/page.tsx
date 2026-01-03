/**
 * Candidates index page
 */

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";

async function CandidatesList({ locale }: { locale: Locale }) {
  const { prisma } = await import("@daleel/db");
  
  const candidates = await prisma.candidate.findMany({
    take: 50,
    orderBy: { fullNameAr: "asc" },
    include: {
      district: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true,
        },
      },
      currentList: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          nameFr: true,
        },
      },
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {candidates.map((candidate: any) => (
        <Link key={candidate.id} href={`/${locale}/candidates/${candidate.slug}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <PlaceholderPhoto
                  style={candidate.placeholderPhotoStyle}
                  seed={candidate.id}
                  size={80}
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {getLocalized(
                      {
                        ar: candidate.fullNameAr,
                        en: candidate.fullNameEn,
                        fr: candidate.fullNameFr,
                      },
                      locale
                    )}
                  </CardTitle>
                  <StatusBadge status={candidate.status} className="mt-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {getLocalized(candidate.district, locale)}
              </p>
              {candidate.currentList && (
                <p className="text-sm text-gray-500 mt-1">
                  {getLocalized(candidate.currentList, locale)}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function CandidatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Candidates</h1>
        <Suspense fallback={<div>Loading candidates...</div>}>
          <CandidatesList locale={locale as Locale} />
        </Suspense>
      </main>
    </div>
  );
}

