/**
 * Districts index page
 */

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { PageLayout } from "@/components/layouts/page-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { getDistrictsList } from "@/lib/queries/districts";
import Link from "next/link";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";

async function DistrictsList({ locale }: { locale: Locale }) {
  const districts = await getDistrictsList();

  if (districts.length === 0) {
    const emptyMessage =
      locale === "ar" ? "لا توجد دوائر" : locale === "fr" ? "Aucune circonscription" : "No districts found";
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {districts.map((district) => (
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

export default async function DistrictsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");

  const description =
    locale === "ar"
      ? "استكشف جميع الدوائر الانتخابية"
      : locale === "fr"
        ? "Explorez toutes les circonscriptions électorales"
        : "Explore all electoral districts";

  return (
    <PageLayout
      title={t("districts")}
      description={description}
      breadcrumbs={[{ label: t("districts") }]}
    >
      <Suspense fallback={<LoadingState />}>
        <DistrictsList locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}

