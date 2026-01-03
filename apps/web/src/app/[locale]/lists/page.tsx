/**
 * Lists index page
 */

import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { PageLayout } from "@/components/layouts/page-layout";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { getListsList } from "@/lib/queries/lists";
import Link from "next/link";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { StatusBadge } from "@/components/status-badge";
import { getTranslations } from "next-intl/server";

async function ListsList({ locale }: { locale: Locale }) {
  const lists = await getListsList();

  if (lists.length === 0) {
    const emptyMessage =
      locale === "ar" ? "لا توجد قوائم" : locale === "fr" ? "Aucune liste" : "No lists found";
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <Link key={list.id} href={`/${locale}/lists/${list.id}`}>
          <Card className="card-hover h-full">
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
              <CardDescription className="truncate">
                {getLocalized(list.district, locale)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <StatusBadge status={list.status} />
                <p className="text-sm text-gray-600">
                  {list._count.candidates}{" "}
                  {locale === "ar" ? "مرشح" : locale === "fr" ? "candidats" : "candidates"}
                </p>
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
        <ListsList locale={locale as Locale} />
      </Suspense>
    </PageLayout>
  );
}

