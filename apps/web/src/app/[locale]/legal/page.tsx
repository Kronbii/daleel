/**
 * Legal hub page
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { getTranslations } from "next-intl/server";

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

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("common");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: t("legal") }]} />
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {locale === "ar" ? "قانوني وإخلاء المسؤولية" : locale === "fr" ? "Légal et avertissements" : "Legal & Disclaimers"}
            </h1>
            <p className="text-lg text-gray-600">
              {locale === "ar"
                ? "يحدد هذا القسم الإطار القانوني والتحريري والأخلاقي الذي يحكم دليل"
                : locale === "fr"
                  ? "Cette section décrit le cadre juridique, éditorial et éthique qui régit Daleel"
                  : "This section outlines the legal, editorial, and ethical framework governing Daleel"}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {legalPages.map((page) => (
              <Link key={page.key} href={`/${locale}/legal/${page.key}`}>
                <Card className="card-hover h-full group">
                  <CardHeader>
                    <CardTitle className="group-hover:text-blue-600 transition-colors duration-200">
                      {getLocalized(page.title, locale as Locale)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

