/**
 * Electoral centers page
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { CentersPageContent } from "@/components/sections/centers-page-content";
import { getCentersList } from "@/lib/queries/centers";
import { getDistrictsList } from "@/lib/queries/districts";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";

async function CentersPageData({ locale }: { locale: Locale }) {
  const [centers, districts] = await Promise.all([
    getCentersList(),
    getDistrictsList(),
  ]);

  // Transform districts to match the expected format
  const districtsList = districts.map((d) => ({
    id: d.id,
    nameAr: d.nameAr,
    nameEn: d.nameEn,
    nameFr: d.nameFr,
  }));

  return (
    <CentersPageContent
      centers={centers}
      districts={districtsList}
      locale={locale}
    />
  );
}

export default async function CentersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");

  const description =
    locale === "ar"
      ? "ابحث عن مراكز الاقتراع على الخريطة"
      : locale === "fr"
        ? "Trouvez les centres de vote sur la carte"
        : "Find voting centers on the map";

  return (
    <PageLayout
      title={t("centers")}
      description={description}
      breadcrumbs={[{ label: t("centers") }]}
    >
      <Suspense fallback={<LoadingState />}>
        <CentersPageData locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}

