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
    <footer className="relative mt-auto bg-gray-50/50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Brand */}
            <div className="md:col-span-5 lg:col-span-6">
              <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-4 group">
                <img 
                  src="/icon.svg" 
                  alt={locale === "ar" ? "دليل" : "Daleel"} 
                  className="h-10 w-auto transition-all duration-300 group-hover:drop-shadow-sm"
                />
                <span className="text-xl font-medium text-gray-900 font-serif">
                  Daleel
                </span>
              </Link>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-4">
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
                      className="px-3 py-1 text-xs font-medium bg-gray-50 text-gray-700 rounded-full border border-gray-200"
                    >
                      {value}
                    </span>
                  ))}
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  {getContent("Explore", "استكشف", "Explorer")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={`/${locale}/candidates`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("candidates")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/districts`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("districts")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/lists`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("lists")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/centers`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("centers")}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href={`/${locale}/electoral-laws`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("electoralLaws")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  {getContent("About", "حول", "À propos")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href={`/${locale}/legal`} 
                      className="text-sm text-gray-600 hover:text-cedar transition-colors duration-200"
                    >
                      {t("legal")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} Daleel.{" "}
              {getContent("All rights reserved.", "جميع الحقوق محفوظة.", "Tous droits réservés.")}
            </p>
            <p className="text-xs text-gray-400">
              {getContent(
                "Built with transparency in mind",
                "صُنع بشفافية",
                "Construit en toute transparence"
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
