/**
 * Electoral List detail page
 */

import { notFound } from "next/navigation";
import { getListById } from "@/lib/queries/lists";
import { DetailLayout } from "@/components/layouts/detail-layout";
import { CandidateCard } from "@/components/candidate-card";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";
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

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <DetailLayout
      title={listName}
      breadcrumbs={[
                { label: t("lists"), href: `/${locale}/lists` },
                { label: listName },
              ]}
      backHref={`/${locale}/lists`}
      maxWidth="6xl"
      headerActions={<StatusBadge status={list.status} />}
    >
      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-semibold text-cedar">{list.candidates.length}</div>
          <div className="text-sm text-gray-500">{getContent("Candidates", "مرشحون", "Candidats")}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-semibold text-cedar">{list.district.seatCount}</div>
          <div className="text-sm text-gray-500">{getContent("Seats", "مقاعد", "Sièges")}</div>
          </div>
                  <Link
                    href={`/${locale}/districts/${list.district.id}`}
          className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:border-cedar/20 transition-colors shadow-sm"
                  >
          <div className="text-sm font-medium text-cedar truncate">
                    {getLocalized(
                      {
                        ar: list.district.nameAr,
                        en: list.district.nameEn,
                        fr: list.district.nameFr,
                      },
                      locale as Locale
                    )}
          </div>
          <div className="text-sm text-gray-500">{getContent("District", "الدائرة", "Circonscription")}</div>
                  </Link>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <div className="text-2xl font-semibold text-emerald-600">{list.cycle.year}</div>
          <div className="text-sm text-gray-500">{getContent("Year", "السنة", "Année")}</div>
            </div>
          </div>

      {/* Additional Info */}
      {(list.announcedAt || list.notes) && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
                {list.announcedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                  {getContent("Announced", "تاريخ الإعلان", "Annoncé le")}
                    </p>
                <p className="text-gray-900">
                  {new Date(list.announcedAt).toLocaleDateString(
                    locale === "ar" ? "ar-LB" : locale === "fr" ? "fr-FR" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                    </p>
                  </div>
                )}
              </div>
              {list.notes && (
            <div className={list.announcedAt ? "mt-4 pt-4 border-t border-gray-100" : ""}>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {getContent("Notes", "ملاحظات", "Notes")}
                  </p>
              <p className="text-gray-700 text-sm">{list.notes}</p>
            </div>
          )}
                </div>
              )}

          {/* Candidates */}
      <section>
        <h2 className="text-xl font-serif font-medium text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cedar" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          {getContent("Candidates", "المرشحون", "Candidats")}
          <span className="text-sm font-normal text-gray-400">({list.candidates.length})</span>
        </h2>
        
              {list.candidates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <p className="text-gray-500">
              {getContent(
                "No candidates in this list yet",
                "لا يوجد مرشحون في هذه القائمة بعد",
                "Aucun candidat dans cette liste pour le moment"
              )}
                </p>
          </div>
              ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
                  {list.candidates.map((candidate: {
                    id: string;
                    slug: string;
                    fullNameAr: string | null;
                    fullNameEn: string | null;
                    fullNameFr: string | null;
                    status: string;
                    placeholderPhotoStyle: string;
                  }) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={{
                        ...candidate,
                        fullNameAr: candidate.fullNameAr || "",
                        fullNameEn: candidate.fullNameEn || "",
                        fullNameFr: candidate.fullNameFr || "",
                      }}
                      locale={locale as Locale}
                    />
                  ))}
                </div>
              )}
      </section>
    </DetailLayout>
  );
}
