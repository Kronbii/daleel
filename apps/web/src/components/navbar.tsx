"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@daleel/ui";
import { SUPPORTED_LOCALES } from "@daleel/core";
import { useState } from "react";

const localeNames: Record<string, { name: string; native: string }> = {
  ar: { name: "Arabic", native: "العربية" },
  en: { name: "English", native: "English" },
  fr: { name: "French", native: "Français" },
};

export function Navbar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/candidates`, label: t("candidates") },
    { href: `/${locale}/districts`, label: t("districts") },
    { href: `/${locale}/lists`, label: t("lists") },
    { href: `/${locale}/legal`, label: t("legal") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-2 rtl:space-x-reverse group transition-transform duration-200 hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-shadow duration-200">
              د
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              Daleel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {/* Language Switcher */}
            <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse border border-gray-200/80 rounded-lg p-1 bg-gray-50/80 backdrop-blur-sm">
              {SUPPORTED_LOCALES.map((loc) => {
                const isActive = locale === loc;
                return (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                    }`}
                  >
                    {localeNames[loc]?.native || loc.toUpperCase()}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {SUPPORTED_LOCALES.map((loc) => {
                    const isActive = locale === loc;
                    return (
                      <Link
                        key={loc}
                        href={`/${loc}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {localeNames[loc]?.native || loc.toUpperCase()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

