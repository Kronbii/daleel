/**
 * Home page - Redesigned minimal landing
 */

import Link from "next/link";
import { getTranslations } from "next-intl/server";

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
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
    {
      title: t("districts"),
      description: t("districtsDesc"),
      href: `/${locale}/districts`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      ),
    },
    {
      title: t("lists"),
      description: t("listsDesc"),
      href: `/${locale}/lists`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #f8faf9 0%, #ffffff 50%, #f0fdf4 100%)",
          }}
        />
        
        {/* Large soft circle - top right */}
        <div 
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          }}
        />
        
        {/* Medium circle - bottom left */}
        <div 
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
          }}
        />
        
        {/* Small accent circle - mid right */}
        <div 
          className="absolute top-1/2 -right-10 w-[200px] h-[200px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(5, 150, 105, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Decorative lines */}
        <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-50" />
        <div className="absolute top-3/4 right-0 w-40 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo/Title */}
            <h1 className="fade-in text-6xl sm:text-7xl md:text-8xl font-normal tracking-tight text-gray-900 mb-6">
              <span className="block">Daleel</span>
              <span className="block text-emerald-700 mt-1">دليل</span>
            </h1>
            
            {/* Tagline */}
            <p className="fade-in fade-in-1 text-xl sm:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              {getContent(
                "Independent civic initiative providing public information about Lebanese parliamentary elections",
                "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية",
                "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises"
              )}
            </p>

            {/* Trust indicators */}
            <div className="fade-in fade-in-2 mt-10 flex items-center justify-center gap-6 sm:gap-10 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {getContent("Transparent", "شفاف", "Transparent")}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {getContent("Neutral", "محايد", "Neutre")}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {getContent("Independent", "مستقل", "Indépendant")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="relative container mx-auto px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <p className="fade-in fade-in-2 text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-8">
            {getContent("Explore", "استكشف", "Explorer")}
          </p>

          {/* Cards Grid */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {navigationCards.map((card, index) => (
              <Link 
                key={card.href} 
                href={card.href}
                className={`fade-in fade-in-${index + 2}`}
              >
                <div className="nav-card group h-full backdrop-blur-sm bg-white/70">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-emerald-100 group-hover:scale-105">
                    {card.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors font-sans">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {card.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className={`mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600 opacity-0 translate-x-0 transition-all duration-300 group-hover:opacity-100 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-4">
              {getContent(
                "Your Guide to Informed Voting",
                "دليلك للتصويت المستنير",
                "Votre guide pour un vote éclairé"
              )}
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              {t("description")}
            </p>
            <Link 
              href={`/${locale}/legal`}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {t("learnMore")}
              <svg 
                className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
