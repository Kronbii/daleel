/**
 * Individual legal page
 */

import { notFound } from "next/navigation";
import { legalContent } from "@/lib/legal-content";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function LegalSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations("common");
  const content = legalContent[slug]?.[locale as "ar" | "en" | "fr"];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Breadcrumbs
              items={[
                { label: t("legal"), href: `/${locale}/legal` },
                { label: content.title },
              ]}
            />
            <BackButton href={`/${locale}/legal`} />
          </div>
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-3xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-line text-gray-700 leading-relaxed">
                {content.content}
              </div>
              <div className="mt-8 pt-6 border-t">
                <Link
                  href={`/${locale}/legal`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← {locale === "ar" ? "العودة إلى الصفحات القانونية" : locale === "fr" ? "Retour aux pages légales" : "Back to Legal Pages"}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

