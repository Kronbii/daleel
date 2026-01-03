/**
 * Electoral List detail page
 */

import { notFound } from "next/navigation";
import { getListById } from "@/lib/queries/lists";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@daleel/ui";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";
import { CandidateCard } from "@/components/candidate-card";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ListDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const list = await getListById(id);

  if (!list) {
    notFound();
  }

  const t = await getTranslations("common");
  const listName = getLocalized(
    {
      ar: list.nameAr,
      en: list.nameEn,
      fr: list.nameFr,
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
                { label: t("lists"), href: `/${locale}/lists` },
                { label: listName },
              ]}
            />
            <BackButton href={`/${locale}/lists`} />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{listName}</h1>
                <p className="text-lg text-gray-600 mb-4">
                  <Link
                    href={`/${locale}/districts/${list.district.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {getLocalized(list.district, locale as Locale)}
                  </Link>
                  {" • "}
                  {list.cycle.year}
                </p>
                <StatusBadge status={list.status} />
              </div>
            </div>
          </div>

          {/* List Info */}
          <Card className="mb-8 card-hover">
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "معلومات القائمة" : locale === "fr" ? "Informations de la liste" : "List Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "الدائرة" : locale === "fr" ? "Circonscription" : "District"}
                  </p>
                  <p className="text-base">
                    {getLocalized(list.district, locale as Locale)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "دورة الانتخابات" : locale === "fr" ? "Cycle électoral" : "Election Cycle"}
                  </p>
                  <p className="text-base">{list.cycle.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "عدد المقاعد" : locale === "fr" ? "Nombre de sièges" : "Seat Count"}
                  </p>
                  <p className="text-base">{list.district.seatCount}</p>
                </div>
                {list.announcedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {locale === "ar" ? "تاريخ الإعلان" : locale === "fr" ? "Date d'annonce" : "Announced At"}
                    </p>
                    <p className="text-base">
                      {new Date(list.announcedAt).toLocaleDateString(locale === "ar" ? "ar-LB" : locale === "fr" ? "fr-FR" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
              {list.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {locale === "ar" ? "ملاحظات" : locale === "fr" ? "Notes" : "Notes"}
                  </p>
                  <p className="text-base text-gray-700">{list.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Candidates */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "ar" ? "المرشحون" : locale === "fr" ? "Candidats" : "Candidates"}
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({list.candidates.length})
                </span>
              </CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "جميع المرشحين في هذه القائمة"
                  : locale === "fr"
                    ? "Tous les candidats de cette liste"
                    : "All candidates in this list"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {list.candidates.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {locale === "ar"
                    ? "لا يوجد مرشحون في هذه القائمة"
                    : locale === "fr"
                      ? "Aucun candidat dans cette liste"
                      : "No candidates in this list"}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-items-center">
                  {list.candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      locale={locale as Locale}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

