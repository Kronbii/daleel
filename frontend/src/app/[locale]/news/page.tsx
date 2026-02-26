/**
 * TODO [Developer]: News Page
 *
 * This page previously displayed hardcoded mock news items (mockNewsItems).
 * It needs to be connected to a real data source. Steps to fix:
 *
 * 1. Create a News/Announcement model in the Prisma schema (see news-preview.tsx TODO).
 *
 * 2. Fetch real news data via the API client:
 *    - import { getNews } from "@/lib/api-client";
 *    - const newsItems = await getNews();
 *
 * 3. Render the news items. The previous UI had:
 *    - A hero section with icon, title, "Live" indicator, subtitle, description
 *    - A scrollable feed of news cards, each with:
 *      category badge (announcement/update/alert/general with color coding),
 *      relative timestamp ("5 mins ago"), headline, summary, "Read more" link
 *    - Links could be internal (/centers) or external (https://...)
 *    - Empty state when no news items exist
 *    - See git history for the full previous markup.
 *
 * 4. Category color mapping was:
 *    - announcement: blue-50/blue-700/blue-200
 *    - update: emerald-50/emerald-700/emerald-200
 *    - alert: amber-50/amber-700/amber-200
 *    - general: gray-50/gray-700/gray-200
 */

import { getTranslations } from "next-intl/server";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("news");
  const isRTL = locale === "ar";

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] overflow-hidden">
      {/* Hero Section */}
      <section className="flex-shrink-0 border-b border-gray-100 bg-white z-10" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 py-3 sm:py-5">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cedar/10 to-cedar/5 text-cedar flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
              </div>
            </div>
            <div className={`flex-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <h1 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-1.5">
                {t("title")}
              </h1>
              <p className="text-sm sm:text-base text-cedar font-medium">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content — placeholder until real news data is connected */}
      <section className="flex-1 overflow-y-auto min-h-0">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              {locale === "ar"
                ? "لا توجد أخبار متاحة حالياً"
                : locale === "fr"
                  ? "Aucune actualité disponible pour le moment"
                  : "No news available at the moment"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
