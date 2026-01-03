/**
 * Individual legal page
 */

import { notFound } from "next/navigation";
import { legalContent } from "@/lib/legal-content";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";

export default async function LegalSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const content = legalContent[slug]?.[locale as "ar" | "en" | "fr"];

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{content.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-line">{content.content}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

