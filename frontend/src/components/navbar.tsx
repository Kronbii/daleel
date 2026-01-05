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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for extra glass intensity when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-white/50 backdrop-blur-2xl backdrop-saturate-150 border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            : "bg-white/25 backdrop-blur-lg backdrop-saturate-100 border-transparent shadow-none"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 sm:gap-3 group p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-white/40 active:scale-95 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/ar-k.svg"
                alt="دليل"
                className="h-7 sm:h-8 md:h-9 w-auto transition-all duration-300 group-hover:drop-shadow-sm"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/30 p-1 rounded-full border border-white/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.01)] backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isActive
                        ? "text-black bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                        : "text-gray-600 hover:text-black hover:bg-white/50"
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Language Switcher & Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher - Desktop (iOS Segmented Control Style) */}
              <div className="hidden md:flex items-center p-0.5 bg-gray-200/40 border border-white/20 rounded-lg shadow-inner">
                {SUPPORTED_LOCALES.map((loc) => {
                  const isActive = locale === loc;
                  return (
                    <Link
                      key={loc}
                      href={`/${loc}`}
                      className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-all duration-300 ease-out ${
                        isActive
                          ? "bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                          : "text-gray-500 hover:text-gray-900 hover:bg-white/30"
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
                className={`md:hidden p-2.5 -mr-2 rounded-full transition-all duration-300 active:scale-95 ${
                  mobileMenuOpen 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-700 hover:bg-white/40"
                }`}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5">
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "w-5 rotate-45 translate-y-2" : "w-4"}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-5"}`} />
                  <span className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? "w-5 -rotate-45 -translate-y-2" : "w-3 ml-auto"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            top: "64px",
            background: "rgba(0, 0, 0, 0.05)",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile Menu - Apple Sheet Style */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] z-50 transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div 
          className="mx-4 mt-2 overflow-hidden rounded-3xl border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
          style={{
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)", // iOS Safari support
          }}
        >
          <div className="p-2 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative px-4 py-3.5 text-base font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                    isActive
                      ? "bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                      : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {link.label}
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cedar shadow-[0_0_8px_currentColor]" />
                    )}
                  </span>
                </Link>
              );
            })}

            {/* Mobile Language Switcher */}
            <div className="mt-2 p-1 bg-gray-200/30 rounded-2xl flex gap-1">
              {SUPPORTED_LOCALES.map((loc) => {
                const isActive = locale === loc;
                return (
                  <Link
                    key={loc}
                    href={`/${loc}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl text-center transition-all duration-200 ${
                      isActive
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
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
    </>
  );
}