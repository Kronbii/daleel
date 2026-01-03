"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Daleel - دليل</h3>
            <p className="text-sm text-gray-600">
              {locale === "ar"
                ? "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية"
                : locale === "fr"
                  ? "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises"
                  : "Independent civic initiative providing public information about Lebanese parliamentary elections"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {locale === "ar" ? "روابط سريعة" : locale === "fr" ? "Liens rapides" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/candidates`} className="text-gray-600 hover:text-gray-900">
                  {t("candidates")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/districts`} className="text-gray-600 hover:text-gray-900">
                  {t("districts")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/lists`} className="text-gray-600 hover:text-gray-900">
                  {t("lists")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {locale === "ar" ? "قانوني" : locale === "fr" ? "Légal" : "Legal"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}/legal`} className="text-gray-600 hover:text-gray-900">
                  {locale === "ar" ? "جميع الصفحات القانونية" : locale === "fr" ? "Toutes les pages légales" : "All Legal Pages"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">
              {locale === "ar" ? "معلومات" : locale === "fr" ? "Informations" : "Information"}
            </h3>
            <p className="text-sm text-gray-600">
              {locale === "ar"
                ? "شفاف. محايد. مستقل."
                : locale === "fr"
                  ? "Transparent. Neutre. Indépendant."
                  : "Transparent. Neutral. Independent."}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Daleel.{" "}
            {locale === "ar"
              ? "جميع الحقوق محفوظة"
              : locale === "fr"
                ? "Tous droits réservés"
                : "All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}

