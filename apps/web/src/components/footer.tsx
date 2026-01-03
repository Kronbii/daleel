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
    <footer className="border-t border-gray-100 bg-gray-50/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Brand */}
            <div className="md:max-w-xs">
              <Link href={`/${locale}`} className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-sm">
                  د
                </div>
                <span className="text-base font-semibold text-gray-900">Daleel</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed">
                {getContent(
                  "Independent civic initiative providing public information about Lebanese parliamentary elections.",
                  "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية.",
                  "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises."
                )}
            </p>
          </div>

            {/* Links */}
            <div className="flex gap-12 sm:gap-16">
          <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {getContent("Explore", "استكشف", "Explorer")}
                </h4>
                <ul className="space-y-2">
              <li>
                    <Link href={`/${locale}/candidates`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {t("candidates")}
                </Link>
              </li>
              <li>
                    <Link href={`/${locale}/districts`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {t("districts")}
                </Link>
              </li>
              <li>
                    <Link href={`/${locale}/lists`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                  {t("lists")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  {getContent("About", "حول", "À propos")}
                </h4>
                <ul className="space-y-2">
              <li>
                    <Link href={`/${locale}/legal`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {t("legal")}
                </Link>
              </li>
            </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Daleel.{" "}
              {getContent("All rights reserved.", "جميع الحقوق محفوظة.", "Tous droits réservés.")}
            </p>
            <p className="text-xs text-gray-400">
              {getContent(
                "Transparent • Neutral • Independent",
                "شفاف • محايد • مستقل",
                "Transparent • Neutre • Indépendant"
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
