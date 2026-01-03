/**
 * Candidates index page
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { CandidatesGrid } from "@/components/sections/candidates-grid";
import { LoadingState } from "@/components/ui/loading-state";
import { getCandidatesList } from "@/lib/queries/candidates";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";

async function CandidatesList({ locale }: { locale: Locale }) {
  const candidates = await getCandidatesList(locale);
  const emptyMessage =
    locale === "ar" ? "لا يوجد مرشحون" : locale === "fr" ? "Aucun candidat" : "No candidates found";

  return <CandidatesGrid candidates={candidates as any} locale={locale} emptyMessage={emptyMessage} />;
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
        <CandidatesList locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}
