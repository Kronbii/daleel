
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { mockNewsItems } from "@/lib/mock-data";

export default async function NewsPreview({ locale }: { locale: string }) {
  const t = await getTranslations("news");
  const tCommon = await getTranslations("common");
  const isRTL = locale === "ar";

  // Get latest 3 items
  const latestNews = mockNewsItems.slice(0, 3);

  // Helper to get localized text
  const getLocalizedText = (obj: any) => {
    return obj[locale as keyof typeof obj] || obj.en;
  };

  // Helper to format timestamp
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return `${diffMins} ${t("minutesAgo")}`;
    if (diffHours < 24) return `${diffHours} ${t("hoursAgo")}`;
    return `${diffDays} ${t("daysAgo")}`;
  };

  // Category styling
  const getCategoryStyles = (category: string) => {
    const styles = {
      announcement: "bg-blue-50 text-blue-700 border-blue-200",
      update: "bg-emerald-50 text-emerald-700 border-emerald-200",
      alert: "bg-amber-50 text-amber-700 border-amber-200",
      general: "bg-gray-50 text-gray-700 border-gray-200"
    };
    return styles[category as keyof typeof styles] || styles.general;
  };

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-gray-900">
              {t("title")}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-wider">
                {locale === "ar" ? "مباشر" : locale === "fr" ? "En Direct" : "Live"}
              </span>
            </div>
          </div>

          <Link
            href={`/${locale}/news`}
            className="group flex items-center gap-1 text-sm font-medium text-cedar hover:text-cedar-dark transition-colors"
          >
            <span>{getContent("View all", "عرض الكل", "Voir tout")}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid gap-4 sm:gap-6">
          {latestNews.map((item, index) => {
            const isExternal = item.link.startsWith("http");
            const href = isExternal ? item.link : `/${locale}${item.link}`;

            return (
              <Link
                key={item.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`block h-full relative z-10 fade-in fade-in-${index + 1}`}
              >
                <article className="group relative bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-cedar/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`flex flex-wrap items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getCategoryStyles(item.category)}`}>
                          {t(`categories.${item.category}`)}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          {getTimeAgo(item.timestamp)}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 group-hover:text-cedar transition-colors line-clamp-1">
                        {getLocalizedText(item.headline)}
                      </h3>

                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {getLocalizedText(item.summary)}
                      </p>
                    </div>

                    {/* Arrow Icon (Desktop) */}
                    <div className={`hidden sm:flex items-center text-gray-300 group-hover:text-cedar transition-colors ${isRTL ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
