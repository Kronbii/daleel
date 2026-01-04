"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  return (
    <footer className="relative mt-auto bg-gradient-to-br from-gray-900 via-gray-800 to-cedar text-gray-100">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cedar-light via-cedar to-cedar-light"></div>
      
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            {/* Brand - Takes more space */}
            <div className="md:col-span-5 lg:col-span-6">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cedar-light to-cedar text-white font-bold text-xl shadow-lg shadow-cedar/30 group-hover:shadow-cedar/50 transition-all duration-300 group-hover:scale-110 font-serif">
                  د
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-serif">
                  Daleel
                </span>
              </Link>
              <p className="text-sm text-gray-300 leading-relaxed max-w-md mb-6">
                {getContent(
                  "Independent civic initiative providing public information about Lebanese parliamentary elections.",
                  "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية.",
                  "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises."
                )}
              </p>
              {/* Values badges */}
              <div className="flex flex-wrap gap-2">
                {getContent(
                  "Transparent • Neutral • Independent",
                  "شفاف • محايد • مستقل",
                  "Transparent • Neutre • Indépendant"
                )
                  .split(" • ")
                  .map((value, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-cedar/20 text-cedar-light rounded-full border border-cedar/30 backdrop-blur-sm"
                    >
                      {value}
                    </span>
                  ))}
              </div>
            </div>

            {/* Links - More compact */}
            <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-cedar rounded-full"></span>
                  {getContent("Explore", "استكشف", "Explorer")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href={`/${locale}/candidates`} 
                      className="text-sm text-gray-300 hover:text-cedar-light transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cedar-light group-hover:w-4 transition-all duration-200"></span>
                      {t("candidates")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/districts`} 
                      className="text-sm text-gray-300 hover:text-cedar-light transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cedar-light group-hover:w-4 transition-all duration-200"></span>
                      {t("districts")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/lists`} 
                      className="text-sm text-gray-300 hover:text-cedar-light transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cedar-light group-hover:w-4 transition-all duration-200"></span>
                      {t("lists")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-cedar rounded-full"></span>
                  {getContent("About", "حول", "À propos")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      href={`/${locale}/legal`} 
                      className="text-sm text-gray-300 hover:text-cedar-light transition-colors duration-200 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-cedar-light group-hover:w-4 transition-all duration-200"></span>
                      {t("legal")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-700/50 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Daleel.{" "}
              {getContent("All rights reserved.", "جميع الحقوق محفوظة.", "Tous droits réservés.")}
            </p>
            <p className="text-xs text-gray-500">
              {getContent(
                "Built with transparency in mind",
                "صُنع بشفافية",
                "Construit en toute transparence"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cedar rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cedar-light rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
}
