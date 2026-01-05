"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { SUPPORTED_LOCALES } from "@daleel/shared";
import { useState, useEffect } from "react";

const localeNames: Record<string, { name: string; native: string }> = {
  ar: { name: "Arabic", native: "ع" },
  en: { name: "English", native: "EN" },
  fr: { name: "French", native: "FR" },
};

export function Navbar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
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
    { href: `/${locale}/centers`, label: t("centers") },
    { href: `/${locale}/legal`, label: t("legal") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 sm:gap-3 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-cedar/5 active:bg-cedar/10 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img 
              src="/ar-k.svg" 
              alt="دليل" 
              className="h-1 sm:h-8 w-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-110" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 lg:px-5 py-2.5 text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? "text-cedar"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Underline indicator */}
                  <span 
                    className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-cedar transition-all duration-300 ${
                      isActive 
                        ? "w-3/4 opacity-100" 
                        : "w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100"
                    }`}
                  />
                  {/* Subtle background on hover */}
                  <span className="absolute inset-0 rounded-lg bg-cedar/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
                </Link>
              );
            })}
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:flex items-center gap-0.5 bg-gray-50/80 border border-gray-200/60 rounded-xl p-1 shadow-sm">
              {SUPPORTED_LOCALES.map((loc) => {
                const isActive = locale === loc;
                return (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-white text-cedar shadow-sm"
                        : "text-gray-600 hover:text-cedar hover:bg-white/50"
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
              className="md:hidden p-2.5 -mr-2 rounded-xl text-gray-700 hover:text-cedar hover:bg-cedar/5 transition-all duration-300 active:bg-cedar/10"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="h-5 w-5 transition-transform duration-300"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          style={{ top: "64px" }}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed left-0 right-0 bg-white/98 backdrop-blur-xl border-b border-gray-200/60 shadow-2xl z-50 transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{ top: "64px" }}
      >
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative px-4 py-3.5 text-base font-medium rounded-lg transition-all duration-300 active:scale-[0.98] group ${
                    isActive
                      ? "text-cedar"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                  </span>
                  {/* Left border indicator */}
                  <span 
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-cedar rounded-r-full transition-all duration-300 ${
                      isActive 
                        ? "opacity-100" 
                        : "opacity-0 group-hover:opacity-50"
                    }`}
                  />
                  {/* Subtle background */}
                  <span 
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? "bg-cedar/5" 
                        : "bg-transparent group-hover:bg-gray-50/50"
                    }`}
                  />
                </Link>
              );
            })}
            
            {/* Language Switcher - Mobile */}
            <div className="mt-5 pt-5 border-t border-gray-200/60">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
                      className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl text-center transition-all duration-300 active:scale-[0.98] ${
                        isActive
                          ? "bg-cedar text-white shadow-md"
                          : "text-gray-600 hover:text-cedar hover:bg-cedar/5 border border-gray-200/60"
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
