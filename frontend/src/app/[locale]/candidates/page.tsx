/**
 * Candidates index page
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { CandidatesPageContent } from "@/components/sections/candidates-page-content";
import { LoadingState } from "@/components/ui/loading-state";
import { getCandidatesList } from "@/lib/queries/candidates";
import { getDistrictsList } from "@/lib/queries/districts";
import { getListsList } from "@/lib/queries/lists";
import type { Locale } from "@daleel/shared";
import { getTranslations } from "next-intl/server";

async function CandidatesPageData({ locale }: { locale: Locale }) {
  const [candidates, districts, lists] = await Promise.all([
    getCandidatesList(locale),
    getDistrictsList(),
    getListsList(),
  ]);

  return (
    <CandidatesPageContent
      candidates={candidates}
      districts={districts}
      lists={lists}
      locale={locale}
    />
  );
}

export default async function CandidatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("common");

  const description =
    locale === "ar"
      ? "تصفح جميع المرشحين في الانتخابات النيابية"
      : locale === "fr"
        ? "Parcourir tous les candidats aux élections parlementaires"
        : "Browse all candidates in the parliamentary elections";

  return (
    <PageLayout
      title={t("candidates")}
      description={description}
      breadcrumbs={[{ label: t("candidates") }]}
    >
      <Suspense fallback={<LoadingState />}>
        <CandidatesPageData locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}
