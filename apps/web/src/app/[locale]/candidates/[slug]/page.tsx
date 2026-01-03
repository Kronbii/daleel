/**
 * Candidate profile page
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
  candidate.affiliations.forEach((a) => sourceIds.add(a.sourceId));
  candidate.statements.forEach((s) => sourceIds.add(s.sourceId));

  const sources = await prisma.source.findMany({
    where: { id: { in: Array.from(sourceIds) } },
  });

  // Group statements by topic
  const statementsByTopic = candidate.statements.reduce((acc, stmt) => {
    const key = stmt.topic.key;
    if (!acc[key]) {
      acc[key] = {
        topic: stmt.topic,
        statements: [],
      };
    }
    acc[key].statements.push(stmt);
    return acc;
  }, {} as Record<string, { topic: typeof candidate.statements[0]["topic"]; statements: typeof candidate.statements }>);

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

  return (
    <DetailLayout
      title={name}
      breadcrumbs={[
        { label: t("candidates"), href: `/${locale}/candidates` },
        { label: name },
      ]}
      backHref={`/${locale}/candidates`}
      maxWidth="4xl"
    >
      {/* Profile Header Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <PlaceholderPhoto
              style={candidate.placeholderPhotoStyle}
              seed={candidate.id}
              size={140}
              className="rounded-2xl shadow-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 font-sans">{name}</h2>
                <StatusBadge status={candidate.status} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <Link
                  href={`/${locale}/districts/${candidate.district.id}`}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {getLocalized(candidate.district, locale as Locale)}
                </Link>
              </div>
              {candidate.currentList && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <Link
                    href={`/${locale}/lists/${candidate.currentList.id}`}
                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {getLocalized(candidate.currentList, locale as Locale)}
                  </Link>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-gray-500">
                  {getContent("Updated", "تم التحديث", "Mis à jour")}{" "}
                  {new Date(candidate.updatedAt).toLocaleDateString(
                    locale === "ar" ? "ar-LB" : locale === "fr" ? "fr-FR" : "en-US"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliations */}
      {candidate.affiliations.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            {getContent("Political Affiliations", "الانتماءات السياسية", "Affiliations politiques")}
          </h3>
          <div className="space-y-4">
            {candidate.affiliations.map((aff) => (
              <div key={aff.id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="font-medium text-gray-900">
                  {getLocalized(
                    { ar: aff.nameAr, en: aff.nameEn, fr: aff.nameFr },
                    locale as Locale
                  )}
                  <span className="text-gray-500 font-normal ml-2 text-sm">({aff.type})</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(aff.startDate).toLocaleDateString(locale)}
                  {aff.endDate && ` - ${new Date(aff.endDate).toLocaleDateString(locale)}`}
                </div>
                <a
                  href={aff.source.archivedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mt-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {aff.source.title}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daleel-collected content by topic */}
      {Object.keys(statementsByTopic).length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            {getContent("Collected Content", "المحتوى المجمع", "Contenu collecté")}
          </h3>
          <div className="space-y-6">
            {Object.values(statementsByTopic).map(({ topic, statements }) => (
              <div key={topic.id}>
                <h4 className="text-base font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100">
                  {getLocalized(topic, locale as Locale)}
                </h4>
                <div className="space-y-3">
                  {statements.map((stmt) => (
                    <div key={stmt.id} className="border-l-2 border-emerald-200 pl-4 py-1">
                      {stmt.summaryAr || stmt.summaryEn || stmt.summaryFr ? (
                        <p className="text-gray-700 text-sm leading-relaxed">
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
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {stmt.occurredAt && (
                          <span>{new Date(stmt.occurredAt).toLocaleDateString(locale)}</span>
                        )}
                        <a
                          href={stmt.source.archivedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
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
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            {getContent("Candidate Submissions", "محتوى المرشح", "Soumissions du candidat")}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {getContent(
              "Content submitted directly by the candidate",
              "محتوى مقدم مباشرة من المرشح",
              "Contenu soumis directement par le candidat"
            )}
          </p>
          <div className="space-y-4">
            {candidate.submissions.map((sub) => (
              <div key={sub.id} className="border-l-2 border-blue-200 pl-4 py-2">
                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {getLocalized(
                    {
                      ar: sub.contentAr,
                      en: sub.contentEn,
                      fr: sub.contentFr,
                    },
                    locale as Locale
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {getContent("Submitted", "تم التقديم", "Soumis")} {new Date(sub.submittedAt).toLocaleDateString(locale)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Right of reply */}
      {candidate.rightOfReplies.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {getContent("Right of Reply", "حق الرد", "Droit de réponse")}
          </h3>
          <div className="space-y-4">
            {candidate.rightOfReplies.map((reply) => (
              <div key={reply.id} className="border-l-2 border-green-200 pl-4 py-2">
                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {getLocalized(
                    {
                      ar: reply.contentAr,
                      en: reply.contentEn,
                      fr: reply.contentFr,
                    },
                    locale as Locale
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {getContent("Published", "نُشر", "Publié")} {new Date(reply.submittedAt).toLocaleDateString(locale)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sans flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            {getContent("Sources", "المصادر", "Sources")}
          </h3>
          <ul className="space-y-3">
            {sources.map((source) => (
              <li key={source.id} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                <div>
                  <a
                    href={source.archivedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    {source.title}
                  </a>
                  <span className="text-gray-500 text-sm ml-1">({source.publisher})</span>
                  <div className="text-xs text-gray-400 mt-0.5">
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
