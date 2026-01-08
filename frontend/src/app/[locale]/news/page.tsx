/**
 * Live News Page - Real-time updates and announcements
 * Frontend-only with mock data for demonstration
 */

import { getTranslations } from "next-intl/server";

// Mock news data - in a real app, this would come from an API
const mockNewsItems = [
  {
    id: 1,
    category: "announcement",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    headline: {
      en: "Electoral Centers Map Now Live",
      ar: "خريطة مراكز الاقتراع متاحة الآن",
      fr: "Carte des Centres Électoraux Maintenant Disponible"
    },
    summary: {
      en: "Find your nearest electoral center with our interactive map. Search by location or browse all centers across Lebanon.",
      ar: "ابحث عن أقرب مركز اقتراع لك من خلال خريطتنا التفاعلية. ابحث حسب الموقع أو تصفح جميع المراكز في لبنان.",
      fr: "Trouvez votre centre électoral le plus proche avec notre carte interactive. Recherchez par emplacement ou parcourez tous les centres au Liban."
    }
  },
  {
    id: 2,
    category: "update",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    headline: {
      en: "Candidate Profiles Updated",
      ar: "تحديث ملفات المرشحين",
      fr: "Profils des Candidats Mis à Jour"
    },
    summary: {
      en: "Latest information about candidates has been added. Browse updated profiles with recent statements and affiliations.",
      ar: "تمت إضافة أحدث المعلومات حول المرشحين. تصفح الملفات المحدثة مع أحدث البيانات والانتماءات.",
      fr: "Les dernières informations sur les candidats ont été ajoutées. Parcourez les profils mis à jour avec les déclarations et affiliations récentes."
    }
  },
  {
    id: 3,
    category: "alert",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    headline: {
      en: "Important: Verify Your Voter Registration",
      ar: "هام: تحقق من تسجيلك الانتخابي",
      fr: "Important: Vérifiez Votre Inscription Électorale"
    },
    summary: {
      en: "Make sure you're registered to vote. Check your electoral center location and registration status before election day.",
      ar: "تأكد من تسجيلك للتصويت. تحقق من موقع مركز الاقتراع الخاص بك وحالة التسجيل قبل يوم الانتخابات.",
      fr: "Assurez-vous que vous êtes inscrit pour voter. Vérifiez l'emplacement de votre centre électoral et votre statut d'inscription avant le jour du scrutin."
    }
  },
  {
    id: 4,
    category: "general",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    headline: {
      en: "Electoral Lists Complete Overview Available",
      ar: "نظرة شاملة على اللوائح الانتخابية متاحة",
      fr: "Aperçu Complet des Listes Électorales Disponible"
    },
    summary: {
      en: "View all electoral lists by district. Compare candidates, review platforms, and make informed decisions.",
      ar: "عرض جميع اللوائح الانتخابية حسب الدائرة. قارن المرشحين، واطلع على البرامج، واتخذ قرارات مستنيرة.",
      fr: "Consultez toutes les listes électorales par circonscription. Comparez les candidats, examinez les programmes et prenez des décisions éclairées."
    }
  },
  {
    id: 5,
    category: "announcement",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    headline: {
      en: "New District Information Pages",
      ar: "صفحات معلومات جديدة عن الدوائر",
      fr: "Nouvelles Pages d'Information sur les Circonscriptions"
    },
    summary: {
      en: "Explore detailed information about each electoral district, including demographics and registered voters.",
      ar: "استكشف معلومات مفصلة عن كل دائرة انتخابية، بما في ذلك التركيبة السكانية والناخبين المسجلين.",
      fr: "Explorez des informations détaillées sur chaque circonscription électorale, y compris les données démographiques et les électeurs inscrits."
    }
  },
  {
    id: 6,
    category: "update",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    headline: {
      en: "Platform Features Enhancement",
      ar: "تحسين ميزات المنصة",
      fr: "Amélioration des Fonctionnalités de la Plateforme"
    },
    summary: {
      en: "We've improved search functionality and added new filters to help you find information faster and more efficiently.",
      ar: "قمنا بتحسين وظيفة البحث وأضفنا مرشحات جديدة لمساعدتك في العثور على المعلومات بشكل أسرع وأكثر كفاءة.",
      fr: "Nous avons amélioré la fonctionnalité de recherche et ajouté de nouveaux filtres pour vous aider à trouver des informations plus rapidement et plus efficacement."
    }
  }
];

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("news");
  const tCommon = await getTranslations("common");
  const isRTL = locale === "ar";

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

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] overflow-hidden">
      {/* Hero Section - Compact & Integrated */}
      <section className="flex-shrink-0 border-b border-gray-100 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-sm z-10" dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 py-3 sm:py-5">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
            {/* Icon - Compact */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-cedar/10 to-cedar/5 text-cedar flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className={`flex-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
              <div className={`flex flex-wrap items-center justify-center ${isRTL ? 'sm:justify-start' : 'sm:justify-start'} gap-x-3 gap-y-1 mb-1.5`}>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-gray-900">
                  {t("title")}
                </h1>

                {/* Live Indicator - Integrated */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 border border-red-100 self-center">
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-wider">
                    {locale === "ar" ? "مباشر" : locale === "fr" ? "En Direct" : "Live"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm sm:text-base text-cedar font-medium">
                  {t("subtitle")}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 max-w-2xl hidden sm:block leading-relaxed">
                  {t("description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Feed Section - Scrollable Area */}
      <section className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative z-0">
        <div className="container mx-auto px-4 py-6 sm:py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* News Grid */}
            <div className="grid gap-4 sm:gap-6 pb-20 sm:pb-8">
              {mockNewsItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`fade-in fade-in-${Math.min(index + 1, 4)} group`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="h-full backdrop-blur-md bg-white/80 border border-white/50 shadow-sm hover:shadow-xl hover:shadow-cedar/5 hover:border-cedar/20 rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:-translate-y-1">
                    {/* Header */}
                    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {/* Category Badge */}
                      <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border ${getCategoryStyles(item.category)}`}>
                        {t(`categories.${item.category}`)}
                      </span>

                      {/* Timestamp */}
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {getTimeAgo(item.timestamp)}
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-lg sm:text-2xl font-serif font-medium text-gray-900 mb-2 sm:mb-3 group-hover:text-cedar transition-colors line-clamp-2">
                      {getLocalizedText(item.headline)}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                      {getLocalizedText(item.summary)}
                    </p>

                    {/* Read More Link */}
                    <div className={`flex items-center gap-2 text-sm font-medium text-cedar opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span>{t("readMore")}</span>
                      <svg
                        className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State for Future */}
            {mockNewsItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  {locale === "ar" ? "لا توجد أخبار متاحة حالياً" : locale === "fr" ? "Aucune actualité disponible pour le moment" : "No news available at the moment"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
