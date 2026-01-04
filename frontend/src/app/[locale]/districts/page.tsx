/**
 * Districts index page
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { DistrictsPageContent } from "@/components/sections/districts-page-content";
import { getDistrictsList } from "@/lib/queries/districts";
import type { Locale } from "@daleel/shared";
import { getTranslations } from "next-intl/server";

async function DistrictsPageData({ locale }: { locale: Locale }) {
  const districts = await getDistrictsList();
  return <DistrictsPageContent districts={districts} locale={locale} />;
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
        <DistrictsPageData locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}

