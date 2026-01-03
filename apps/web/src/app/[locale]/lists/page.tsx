/**
 * Lists index page
 */

import { Suspense } from "react";
import { PageLayout } from "@/components/layouts/page-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { ListsPageContent } from "@/components/sections/lists-page-content";
import { getListsList } from "@/lib/queries/lists";
import { getDistrictsList } from "@/lib/queries/districts";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";

async function ListsPageData({ locale }: { locale: Locale }) {
  const [lists, districts] = await Promise.all([getListsList(), getDistrictsList()]);
  return <ListsPageContent lists={lists} districts={districts} locale={locale} />;
}

export default async function ListsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");

  const title =
    locale === "ar" ? "القوائم الانتخابية" : locale === "fr" ? "Listes électorales" : "Electoral Lists";
  const description =
    locale === "ar"
      ? "شاهد جميع القوائم الانتخابية"
      : locale === "fr"
        ? "Voir toutes les listes électorales"
        : "View all electoral lists";

  return (
    <PageLayout title={title} description={description} breadcrumbs={[{ label: t("lists") }]}>
      <Suspense fallback={<LoadingState />}>
        <ListsPageData locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}
