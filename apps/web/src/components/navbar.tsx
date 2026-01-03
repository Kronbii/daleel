"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { SUPPORTED_LOCALES } from "@daleel/core";
import { useState, useEffect } from "react";

const localeNames: Record<string, { name: string; native: string }> = {
  ar: { name: "Arabic", native: "ع" },
  en: { name: "English", native: "EN" },
  fr: { name: "French", native: "FR" },
};

export function Navbar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: `/${locale}/candidates`, label: t("candidates") },
    { href: `/${locale}/districts`, label: t("districts") },
    { href: `/${locale}/lists`, label: t("lists") },
    { href: `/${locale}/legal`, label: t("legal") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 sm:gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-emerald-700 text-white font-bold text-sm sm:text-base transition-transform duration-200 group-hover:scale-105">
              د
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              Daleel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
              {SUPPORTED_LOCALES.map((loc) => {
                const isActive = locale === loc;
                return (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    className={`px-2 lg:px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
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
              className="md:hidden p-2.5 -mr-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors active:bg-gray-100"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-5 w-5"
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
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{ top: "56px" }}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed left-0 right-0 bg-white border-b border-gray-100 shadow-xl z-50 transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: "56px" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors active:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Switcher - Mobile */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Language
              </p>
              <div className="flex items-center gap-2 px-4">
                {SUPPORTED_LOCALES.map((loc) => {
                  const isActive = locale === loc;
                  return (
                    <Link
                      key={loc}
                      href={`/${loc}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl text-center transition-colors ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100 border border-gray-200"
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
      </div>
    </nav>
  );
}
