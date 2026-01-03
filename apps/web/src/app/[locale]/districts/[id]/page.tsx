/**
 * District detail page
 */

import { notFound } from "next/navigation";
import { getDistrictById } from "@/lib/queries/districts";
import { DetailLayout } from "@/components/layouts/detail-layout";
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

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <DetailLayout
      title={districtName}
      subtitle={`${district.cycle.name} • ${district.seatCount} ${getContent("seats", "مقعد", "sièges")}`}
      breadcrumbs={[
        { label: t("districts"), href: `/${locale}/districts` },
        { label: districtName },
      ]}
      backHref={`/${locale}/districts`}
      maxWidth="6xl"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-600">{district.seatCount}</div>
          <div className="text-sm text-gray-500">{getContent("Seats", "مقاعد", "Sièges")}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-600">{district.candidates.length}</div>
          <div className="text-sm text-gray-500">{getContent("Candidates", "مرشحون", "Candidats")}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-600">{district.lists.length}</div>
          <div className="text-sm text-gray-500">{getContent("Lists", "قوائم", "Listes")}</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
          <div className="text-2xl font-semibold text-emerald-600">{district.cycle.year}</div>
          <div className="text-sm text-gray-500">{getContent("Year", "السنة", "Année")}</div>
        </div>
      </div>

      {/* Notes if any */}
      {district.notes && (
        <div className="bg-amber-50/70 backdrop-blur-sm rounded-xl border border-amber-100 p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p className="text-sm text-amber-800">{district.notes}</p>
          </div>
        </div>
      )}

      {/* Electoral Lists */}
      {district.lists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {getContent("Electoral Lists", "القوائم الانتخابية", "Listes électorales")}
            <span className="text-sm font-normal text-gray-400">({district.lists.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {district.lists.map((list) => (
              <Link
                key={list.id}
                href={`/${locale}/lists/${list.id}`}
                className="block group"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {getLocalized(
                        {
                          ar: list.nameAr,
                          en: list.nameEn,
                          fr: list.nameFr,
                        },
                        locale as Locale
                      )}
                    </h3>
                    <StatusBadge status={list.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {list._count.candidates} {getContent("candidates", "مرشح", "candidats")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Candidates */}
      {district.candidates.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            {getContent("Candidates", "المرشحون", "Candidats")}
            <span className="text-sm font-normal text-gray-400">({district.candidates.length})</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
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
        </section>
      )}
    </DetailLayout>
  );
}
