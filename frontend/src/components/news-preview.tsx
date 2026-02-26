/**
 * TODO [Developer]: News Preview Section
 *
 * This component previously used hardcoded mock news data (mockNewsItems).
 * It needs to be connected to a real data source. Steps to fix:
 *
 * 1. Create a News/Announcement model in the Prisma schema with fields:
 *    - id, category (announcement|update|alert|general), publishedAt,
 *    - headlineAr, headlineEn, headlineFr, summaryAr, summaryEn, summaryFr,
 *    - link (internal path or external URL)
 *
 * 2. Create a backend API endpoint: GET /api/public/news
 *    - Return latest news items, ordered by publishedAt desc
 *    - Follow the pattern in backend/src/api/public/candidates.ts
 *
 * 3. Add getNews() to frontend/src/lib/api-client.ts
 *    - Follow the pattern of getCandidates()
 *
 * 4. Fetch real news data in this component and render it.
 *    - The previous UI rendered a grid of news cards with:
 *      category badge, timestamp (relative "X mins ago"), headline, summary,
 *      and a link (internal or external). See git history for the old markup.
 *
 * 5. The home page (app/[locale]/page.tsx) renders <NewsPreview locale={locale} />.
 *    Make sure the component still accepts { locale: string } as a prop.
 */

import { getTranslations } from "next-intl/server";
import { Newspaper } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export default async function NewsPreview({ locale }: { locale: string }) {
  const t = await getTranslations("news");

  return (
    <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeader icon={Newspaper} title={t("title")} />

        {/* Placeholder until real news data is connected */}
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            {locale === "ar"
              ? "قريباً — الأخبار والتحديثات"
              : locale === "fr"
                ? "Bientôt — Actualités et mises à jour"
                : "Coming soon — News & updates"}
          </p>
        </div>
      </div>
    </section>
  );
}
