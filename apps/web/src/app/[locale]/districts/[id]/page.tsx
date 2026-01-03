/**
 * District detail page
 */

import { notFound } from "next/navigation";
import { getDistrictById } from "@/lib/queries/districts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";
import { CandidateCard } from "@/components/candidate-card";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function DistrictDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations("common");

  const district = await getDistrictById(id);

  if (!district) {
    notFound();
  }
  const districtName = getLocalized(
    {
      ar: district.nameAr,
      en: district.nameEn,
      fr: district.nameFr,
    },
    locale as Locale
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs & Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs
              items={[
                { label: t("districts"), href: `/${locale}/districts` },
                { label: districtName },
              ]}
            />
            <BackButton href={`/${locale}/districts`} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{districtName}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  {district.cycle.name} • {district.seatCount}{" "}
                  {locale === "ar" ? "مقعد" : locale === "fr" ? "sièges" : "seats"}
                </p>
              </div>
            </div>
          </div>

          {/* District Info */}
          <Card className="mb-8 card-hover">
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "معلومات الدائرة" : locale === "fr" ? "Informations de la circonscription" : "District Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "دورة الانتخابات" : locale === "fr" ? "Cycle électoral" : "Election Cycle"}
                  </p>
                  <p className="text-base">{district.cycle.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "عدد المقاعد" : locale === "fr" ? "Nombre de sièges" : "Seat Count"}
                  </p>
                  <p className="text-base">{district.seatCount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "عدد المرشحين" : locale === "fr" ? "Nombre de candidats" : "Candidates"}
                  </p>
                  <p className="text-base">{district.candidates.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "عدد القوائم" : locale === "fr" ? "Nombre de listes" : "Electoral Lists"}
                  </p>
                  <p className="text-base">{district.lists.length}</p>
                </div>
              </div>
              {district.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {locale === "ar" ? "ملاحظات" : locale === "fr" ? "Notes" : "Notes"}
                  </p>
                  <p className="text-base text-gray-700">{district.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Electoral Lists */}
          {district.lists.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>
                  {locale === "ar" ? "القوائم الانتخابية" : locale === "fr" ? "Listes électorales" : "Electoral Lists"}
                  <span className="ml-2 text-lg font-normal text-gray-500">
                    ({district.lists.length})
                  </span>
                </CardTitle>
                <CardDescription>
                  {locale === "ar"
                    ? "جميع القوائم الانتخابية في هذه الدائرة"
                    : locale === "fr"
                      ? "Toutes les listes électorales de cette circonscription"
                      : "All electoral lists in this district"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {district.lists.map((list) => (
                    <Link
                      key={list.id}
                      href={`/${locale}/lists/${list.id}`}
                      className="block"
                    >
                      <Card className="card-hover h-full">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {getLocalized(
                              {
                                ar: list.nameAr,
                                en: list.nameEn,
                                fr: list.nameFr,
                              },
                              locale as Locale
                            )}
                          </CardTitle>
                          <CardDescription>
                            <StatusBadge status={list.status} />
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            {list._count.candidates}{" "}
                            {locale === "ar" ? "مرشح" : locale === "fr" ? "candidats" : "candidates"}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Candidates */}
          {district.candidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === "ar" ? "المرشحون" : locale === "fr" ? "Candidats" : "Candidates"}
                  <span className="ml-2 text-lg font-normal text-gray-500">
                    ({district.candidates.length})
                  </span>
                </CardTitle>
                <CardDescription>
                  {locale === "ar"
                    ? "جميع المرشحين في هذه الدائرة"
                    : locale === "fr"
                      ? "Tous les candidats de cette circonscription"
                      : "All candidates in this district"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-items-center">
                  {district.candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={{
                        ...candidate,
                        district: {
                          nameAr: district.nameAr,
                          nameEn: district.nameEn,
                          nameFr: district.nameFr,
                        },
                      }}
                      locale={locale as Locale}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

