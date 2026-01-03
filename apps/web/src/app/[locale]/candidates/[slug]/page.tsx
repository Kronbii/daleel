/**
 * Candidate profile page (Mobile-responsive)
 */

import { notFound } from "next/navigation";
import { getCandidateBySlug } from "@/lib/queries/candidates";
import { DetailLayout } from "@/components/layouts/detail-layout";
import { prisma } from "@daleel/db";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const candidate = await getCandidateBySlug(slug);

  if (!candidate) {
    notFound();
  }

  // Get all sources
  const sourceIds = new Set<string>();
  candidate.affiliations?.forEach((a) => sourceIds.add(a.sourceId));
  candidate.statements?.forEach((s) => sourceIds.add(s.sourceId));

  const sources = await prisma.source.findMany({
    where: { id: { in: Array.from(sourceIds) } },
  });

  // Group statements by topic
  const statements = candidate.statements || [];
  const statementsByTopic = statements.reduce((acc, stmt) => {
    const key = stmt.topic.key;
    if (!acc[key]) {
      acc[key] = {
        topic: stmt.topic,
        statements: [],
      };
    }
    acc[key].statements.push(stmt);
    return acc;
  }, {} as Record<string, { topic: typeof statements[0]["topic"]; statements: typeof statements }>);

  const name = getLocalized(
    {
      ar: candidate.fullNameAr,
      en: candidate.fullNameEn,
      fr: candidate.fullNameFr,
    },
    locale as Locale
  );

  const t = await getTranslations("common");

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  // Get district name for display
  const districtName = getLocalized(
    {
      ar: candidate.district.nameAr,
      en: candidate.district.nameEn,
      fr: candidate.district.nameFr,
    },
    locale as Locale
  );
  const listName = candidate.currentList
    ? getLocalized(
        {
          ar: candidate.currentList.nameAr,
          en: candidate.currentList.nameEn,
          fr: candidate.currentList.nameFr,
        },
        locale as Locale
      )
    : null;

  return (
    <DetailLayout
      title={name}
      subtitle={
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-500">
          <Link
            href={`/${locale}/districts/${candidate.district.id}`}
            className="text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {districtName}
          </Link>
          {listName && (
            <>
              <span className="text-gray-300">•</span>
              <Link
                href={`/${locale}/lists/${candidate.currentList!.id}`}
                className="text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {listName}
              </Link>
            </>
          )}
        </div>
      }
      headerActions={<StatusBadge status={candidate.status} />}
      breadcrumbs={[
        { label: t("candidates"), href: `/${locale}/candidates` },
        { label: name },
      ]}
      backHref={`/${locale}/candidates`}
      maxWidth="4xl"
    >
      {/* Profile Header Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Photo - centered on all screens */}
          <div className="flex-shrink-0">
            <PlaceholderPhoto
              style={candidate.placeholderPhotoStyle}
              seed={candidate.id}
              size={120}
              className="rounded-xl sm:rounded-2xl shadow-md sm:w-[160px] sm:h-[160px]"
            />
          </div>
          
          {/* Quick Info Grid */}
          <div className="w-full grid grid-cols-2 gap-2 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50/50 rounded-lg sm:rounded-xl">
              <div className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                {getContent("District", "الدائرة", "Circonscription")}
              </div>
              <Link
                href={`/${locale}/districts/${candidate.district.id}`}
                className="text-gray-900 font-medium hover:text-emerald-600 transition-colors text-sm sm:text-base line-clamp-2"
              >
                {districtName}
              </Link>
            </div>
            {candidate.currentList && (
              <div className="p-3 sm:p-4 bg-gray-50/50 rounded-lg sm:rounded-xl">
                <div className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  {getContent("List", "القائمة", "Liste")}
                </div>
                <Link
                  href={`/${locale}/lists/${candidate.currentList.id}`}
                  className="text-gray-900 font-medium hover:text-emerald-600 transition-colors text-sm sm:text-base line-clamp-2"
                >
                  {listName}
                </Link>
              </div>
            )}
            <div className="p-3 sm:p-4 bg-gray-50/50 rounded-lg sm:rounded-xl">
              <div className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                {getContent("Status", "الحالة", "Statut")}
              </div>
              <StatusBadge status={candidate.status} />
            </div>
            <div className="p-3 sm:p-4 bg-gray-50/50 rounded-lg sm:rounded-xl">
              <div className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                {getContent("Updated", "تحديث", "Mis à jour")}
              </div>
              <span className="text-gray-900 font-medium text-sm sm:text-base">
                {new Date(candidate.updatedAt).toLocaleDateString(
                  locale === "ar" ? "ar-LB" : locale === "fr" ? "fr-FR" : "en-US"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliations */}
      {candidate.affiliations && candidate.affiliations.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-sans flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <span className="truncate">{getContent("Political Affiliations", "الانتماءات السياسية", "Affiliations politiques")}</span>
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {candidate.affiliations.map((aff) => (
              <div key={aff.id} className="pb-3 sm:pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="font-medium text-gray-900 text-sm sm:text-base">
                  {getLocalized(
                    { ar: aff.nameAr, en: aff.nameEn, fr: aff.nameFr },
                    locale as Locale
                  )}
                  <span className="text-gray-500 font-normal ml-1 sm:ml-2 text-xs sm:text-sm">({aff.type})</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {new Date(aff.startDate).toLocaleDateString(locale)}
                  {aff.endDate && ` - ${new Date(aff.endDate).toLocaleDateString(locale)}`}
                </div>
                <a
                  href={aff.source.archivedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 mt-1"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <span className="truncate">{aff.source.title}</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daleel-collected content by topic */}
      {Object.keys(statementsByTopic).length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-sans flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {getContent("Collected Content", "المحتوى المجمع", "Contenu collecté")}
          </h3>
          <div className="space-y-4 sm:space-y-6">
            {Object.values(statementsByTopic).map(({ topic, statements }) => (
              <div key={topic.id}>
                <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2 sm:mb-3 pb-2 border-b border-gray-100">
                  {getLocalized(
                    {
                      ar: topic.nameAr,
                      en: topic.nameEn,
                      fr: topic.nameFr,
                    },
                    locale as Locale
                  )}
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {statements.map((stmt) => (
                    <div key={stmt.id} className="border-l-2 border-emerald-200 pl-3 sm:pl-4 py-1">
                      {stmt.summaryAr || stmt.summaryEn || stmt.summaryFr ? (
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                          {getLocalized(
                            {
                              ar: stmt.summaryAr || "",
                              en: stmt.summaryEn || "",
                              fr: stmt.summaryFr || "",
                            },
                            locale as Locale
                          )}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                        {stmt.occurredAt && (
                          <span>{new Date(stmt.occurredAt).toLocaleDateString(locale)}</span>
                        )}
                        <a
                          href={stmt.source.archivedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 truncate max-w-[200px]"
                        >
                          {stmt.source.title}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Candidate-submitted content */}
      {candidate.submissions.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 font-sans flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <span className="truncate">{getContent("Candidate Submissions", "محتوى المرشح", "Soumissions")}</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            {getContent(
              "Content submitted directly by the candidate",
              "محتوى مقدم مباشرة من المرشح",
              "Contenu soumis directement par le candidat"
            )}
          </p>
          <div className="space-y-3 sm:space-y-4">
            {candidate.submissions.map((sub) => (
              <div key={sub.id} className="border-l-2 border-blue-200 pl-3 sm:pl-4 py-1 sm:py-2">
                <div className="text-gray-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {getLocalized(
                    {
                      ar: sub.contentAr,
                      en: sub.contentEn,
                      fr: sub.contentFr,
                    },
                    locale as Locale
                  )}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                  {getContent("Submitted", "تم التقديم", "Soumis")} {new Date(sub.submittedAt).toLocaleDateString(locale)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Right of reply */}
      {candidate.rightOfReplies.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-sans flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {getContent("Right of Reply", "حق الرد", "Droit de réponse")}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {candidate.rightOfReplies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-green-200 pl-3 sm:pl-4 py-1 sm:py-2">
                <div className="text-gray-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                  {getLocalized(
                    {
                      ar: reply.contentAr,
                      en: reply.contentEn,
                      fr: reply.contentFr,
                    },
                    locale as Locale
                  )}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                  {getContent("Published", "نُشر", "Publié")} {new Date(reply.submittedAt).toLocaleDateString(locale)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 font-sans flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            {getContent("Sources", "المصادر", "Sources")}
          </h3>
          <ul className="space-y-2 sm:space-y-3">
            {sources.map((source) => (
              <li key={source.id} className="flex items-start gap-2 sm:gap-3">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <div className="min-w-0 flex-1">
                  <a
                    href={source.archivedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-xs sm:text-sm font-medium break-words"
                  >
                    {source.title}
                  </a>
                  <span className="text-gray-500 text-xs sm:text-sm ml-1">({source.publisher})</span>
                  <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    {getContent("Archived", "مؤرشف", "Archivé")} {new Date(source.archivedAt).toLocaleDateString(locale)} • {source.archiveMethod}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </DetailLayout>
  );
}
