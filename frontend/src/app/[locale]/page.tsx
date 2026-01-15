/**
 * Home page - Redesigned minimal landing (Mobile-first responsive)
 */

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@daleel/shared";
import { Compass, Info } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { LinkButton } from "@/components/ui/link-button";
import NewsPreview from "@/components/news-preview";
import ElectoralLawsPreview from "@/components/electoral-laws-preview";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");
  const isRTL = locale === "ar";

  const navigationCards = [
    {
      title: t("candidates"),
      description: t("candidatesDesc"),
      href: `/${locale}/candidates`,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
    {
      title: t("districts"),
      description: t("districtsDesc"),
      href: `/${locale}/districts`,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
    },
    {
      title: t("lists"),
      description: t("listsDesc"),
      href: `/${locale}/lists`,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
    },
    {
      title: t("centers"),
      description: t("centersDesc"),
      href: `/${locale}/centers`,
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      ),
    },
  ];

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <div>
      {/* Hero Section */}
      <section>
        <div className="container mx-auto px-4 pt-12 pb-10 sm:pt-20 sm:pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo/Title */}
            <h1 className="fade-in font-normal tracking-tight text-gray-900 mb-4 sm:mb-6">
              <img src="/en-k.svg" alt="Daleel" className="block h-auto w-40 sm:w-48 md:w-56 lg:w-64 mx-auto" />
              <img src="/ar-g.svg" alt="دليل" className="block mt-4 h-auto w-40 sm:w-48 md:w-56 lg:w-64 mx-auto" />
            </h1>

            {/* Tagline */}
            <p className="fade-in fade-in-1 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto px-2">
              {getContent(
                "Independent civic initiative providing public information about Lebanese parliamentary elections",
                "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية",
                "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises"
              )}
            </p>

            {/* Trust indicators */}
            <div className="fade-in fade-in-2 mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 text-xs sm:text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cedar"></span>
                {getContent("Transparent", "شفاف", "Transparent")}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cedar"></span>
                {getContent("Neutral", "محايد", "Neutre")}
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cedar"></span>
                {getContent("Independent", "مستقل", "Indépendant")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            icon={Compass}
            title={getContent("Explore", "استكشف", "Explorer")}
          />

          {/* Cards Grid - Stack on mobile, 2 columns on md, 4 columns on lg+ */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {navigationCards.map((card, index) => (
              <Link
                key={card.href}
                href={card.href}
                className={`fade-in fade-in-${index + 2}`}
              >
                <div className="nav-card group h-full backdrop-blur-md bg-white/80 border border-white/50 shadow-sm hover:shadow-xl hover:shadow-cedar/5 hover:border-cedar/20 p-5 sm:p-6 md:p-8 transition-all duration-300">
                  {/* Mobile: horizontal layout, Desktop: vertical */}
                  <div className="flex md:flex-col items-start gap-4 md:gap-0">
                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cedar/10 text-cedar flex items-center justify-center flex-shrink-0 md:mb-5 transition-all duration-300 group-hover:bg-cedar group-hover:text-white group-hover:scale-110 shadow-sm">
                      {card.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-serif font-medium text-gray-900 mb-1 sm:mb-2 group-hover:text-cedar transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-none group-hover:text-gray-600 transition-colors">
                        {card.description}
                      </p>

                      {/* Arrow indicator - visible on hover for desktop, always subtle on mobile */}
                      <div className={`mt-3 md:mt-5 flex items-center gap-2 text-sm font-medium text-cedar md:opacity-0 md:translate-x-0 transition-all duration-300 md:group-hover:opacity-100 ${isRTL ? 'md:group-hover:-translate-x-1' : 'md:group-hover:translate-x-1'}`}>
                        {getContent("View all", "عرض الكل", "Voir tout")}
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <NewsPreview locale={locale} />

      {/* Electoral Laws Preview Section */}
      <ElectoralLawsPreview locale={locale as Locale} />

      {/* About Section */}
      <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            icon={Info}
            title={getContent(
              "Your Guide to Informed Voting",
              "دليلك للتصويت المستنير",
              "Votre guide pour un vote éclairé"
            )}
          />

          {/* Content Card */}
          <div>
            <div className="bg-gradient-to-br from-cedar/5 via-white to-cedar/5 rounded-2xl border border-cedar/10 p-8 sm:p-10 shadow-sm">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 text-center">
                {t("description")}
              </p>
              
              {/* Key Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { 
                    label: getContent("Transparent", "شفاف", "Transparent"),
                    icon: "✓"
                  },
                  { 
                    label: getContent("Neutral", "محايد", "Neutre"),
                    icon: "✓"
                  },
                  { 
                    label: getContent("Independent", "مستقل", "Indépendant"),
                    icon: "✓"
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-xl border border-gray-100"
                  >
                    <span className="text-cedar font-bold">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <LinkButton
                  href={`/${locale}/legal`}
                  variant="primary"
                  size="md"
                  showArrow={true}
                  isRTL={isRTL}
                >
                  {t("learnMore")}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
