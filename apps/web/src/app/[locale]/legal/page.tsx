/**
 * Legal hub page
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import type { Locale } from "@daleel/core";

const legalPages = [
  { key: "disclaimer", title: { ar: "إخلاء المسؤولية", en: "Disclaimer", fr: "Avertissement" } },
  { key: "neutrality", title: { ar: "الحياد", en: "Neutrality", fr: "Neutralité" } },
  { key: "methodology", title: { ar: "المنهجية", en: "Methodology", fr: "Méthodologie" } },
  { key: "archiving", title: { ar: "الأرشفة", en: "Archiving", fr: "Archivage" } },
  { key: "corrections", title: { ar: "التصحيحات", en: "Corrections", fr: "Corrections" } },
  { key: "candidate-content", title: { ar: "محتوى المرشح", en: "Candidate Content", fr: "Contenu du candidat" } },
  { key: "ai-usage", title: { ar: "استخدام الذكاء الاصطناعي", en: "AI Usage", fr: "Utilisation de l'IA" } },
  { key: "liability", title: { ar: "المسؤولية", en: "Liability", fr: "Responsabilité" } },
  { key: "data-use", title: { ar: "استخدام البيانات", en: "Data Use", fr: "Utilisation des données" } },
];

function getLocalized(title: { ar: string; en: string; fr: string }, locale: string) {
  return title[locale as keyof typeof title] || title.en;
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Legal & Disclaimers</h1>
        <p className="text-lg text-gray-600 mb-12">
          This section outlines the legal, editorial, and ethical framework governing Daleel.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {legalPages.map((page) => (
            <Link key={page.key} href={`/${locale}/legal/${page.key}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{getLocalized(page.title, locale)}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

