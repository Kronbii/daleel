/**
 * Candidate profile page
 */

import { notFound } from "next/navigation";
import { prisma } from "@daleel/db";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@daleel/ui";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const candidate = await prisma.candidate.findUnique({
    where: { slug },
    include: {
      district: true,
      currentList: true,
      affiliations: {
        orderBy: { startDate: "desc" },
        include: {
          source: {
            select: {
              id: true,
              title: true,
              archivedUrl: true,
              archivedAt: true,
            },
          },
        },
      },
      statements: {
        include: {
          topic: true,
          source: {
            select: {
              id: true,
              title: true,
              archivedUrl: true,
              archivedAt: true,
            },
          },
        },
        orderBy: { occurredAt: "desc" },
      },
      submissions: {
        where: { status: "APPROVED" },
        orderBy: { submittedAt: "desc" },
      },
      rightOfReplies: {
        where: { status: "PUBLISHED" },
        orderBy: { submittedAt: "desc" },
      },
    },
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start gap-6">
                <PlaceholderPhoto
                  style={candidate.placeholderPhotoStyle}
                  seed={candidate.id}
                  size={150}
                />
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{name}</CardTitle>
                  <StatusBadge status={candidate.status} className="mb-4" />
                  <CardDescription>
                    {getLocalized(candidate.district, locale as Locale)} • Last updated:{" "}
                    {new Date(candidate.updatedAt).toLocaleDateString(locale)}
                  </CardDescription>
                  {candidate.currentList && (
                    <CardDescription className="mt-2">
                      List: {getLocalized(candidate.currentList, locale as Locale)}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold">District</dt>
                  <dd>{getLocalized(candidate.district, locale as Locale)}</dd>
                </div>
                {candidate.currentList && (
                  <div>
                    <dt className="font-semibold">List</dt>
                    <dd>{getLocalized(candidate.currentList, locale as Locale)}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-semibold">Status</dt>
                  <dd>
                    <StatusBadge status={candidate.status} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Affiliations */}
          {candidate.affiliations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Political Affiliations & Alliances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.affiliations.map((aff) => (
                    <div key={aff.id} className="pb-4 border-b last:border-b-0">
                      <div className="font-semibold">
                        {getLocalized(
                          { ar: aff.nameAr, en: aff.nameEn, fr: aff.nameFr },
                          locale as Locale
                        )}{" "}
                        ({aff.type})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(aff.startDate).toLocaleDateString(locale)}
                        {aff.endDate && ` - ${new Date(aff.endDate).toLocaleDateString(locale)}`}
                      </div>
                      <a
                        href={aff.source.archivedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Source: {aff.source.title}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daleel-collected content by topic */}
          {Object.keys(statementsByTopic).length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Daleel-Collected Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.values(statementsByTopic).map(({ topic, statements }) => (
                    <div key={topic.id}>
                      <h3 className="text-xl font-semibold mb-4">
                        {getLocalized(topic, locale as Locale)}
                      </h3>
                      <div className="space-y-4">
                        {statements.map((stmt) => (
                          <div key={stmt.id} className="border-l-4 border-gray-300 pl-4">
                            {stmt.summaryAr || stmt.summaryEn || stmt.summaryFr ? (
                              <div className="mb-2">
                                {getLocalized(
                                  {
                                    ar: stmt.summaryAr || "",
                                    en: stmt.summaryEn || "",
                                    fr: stmt.summaryFr || "",
                                  },
                                  locale as Locale
                                )}
                              </div>
                            ) : null}
                            <div className="text-sm text-gray-600">
                              {stmt.occurredAt &&
                                new Date(stmt.occurredAt).toLocaleDateString(locale)}
                            </div>
                            <a
                              href={stmt.source.archivedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Source: {stmt.source.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Candidate-submitted content */}
          {candidate.submissions.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Candidate-Submitted Content</CardTitle>
                <CardDescription>
                  This content was submitted directly by the candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.submissions.map((sub) => (
                    <div key={sub.id} className="border-l-4 border-blue-300 pl-4">
                      <div className="whitespace-pre-line">
                        {getLocalized(
                          {
                            ar: sub.contentAr,
                            en: sub.contentEn,
                            fr: sub.contentFr,
                          },
                          locale as Locale
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString(locale)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Right of reply */}
          {candidate.rightOfReplies.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Right of Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.rightOfReplies.map((reply) => (
                    <div key={reply.id} className="border-l-4 border-green-300 pl-4">
                      <div className="whitespace-pre-line">
                        {getLocalized(
                          {
                            ar: reply.contentAr,
                            en: reply.contentEn,
                            fr: reply.contentFr,
                          },
                          locale as Locale
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        Published: {new Date(reply.submittedAt).toLocaleDateString(locale)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {sources.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sources & Archived Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sources.map((source) => (
                    <li key={source.id}>
                      <a
                        href={source.archivedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {source.title} ({source.publisher})
                      </a>
                      <div className="text-sm text-gray-600">
                        Archived: {new Date(source.archivedAt).toLocaleDateString(locale)} via{" "}
                        {source.archiveMethod}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

