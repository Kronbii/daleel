/**
 * Individual legal page
 */

import { notFound } from "next/navigation";
import { legalContent } from "@/lib/legal-content";
import { DetailLayout } from "@/components/layouts/detail-layout";
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

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <DetailLayout
      title={content.title}
      breadcrumbs={[
        { label: t("legal"), href: `/${locale}/legal` },
        { label: content.title },
      ]}
      backHref={`/${locale}/legal`}
      maxWidth="2xl"
    >
      <article className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed text-sm sm:text-base">
            {content.content}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href={`/${locale}/legal`}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            {getContent("Back to Legal Pages", "العودة إلى الصفحات القانونية", "Retour aux pages légales")}
          </Link>
        </div>
      </article>
    </DetailLayout>
  );
}
