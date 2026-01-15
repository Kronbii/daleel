"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const locale = useLocale();

  return (
    <nav className="flex items-center text-xs sm:text-sm rtl:flex-row-reverse overflow-x-auto" aria-label="Breadcrumb">
      <Link 
        href={`/${locale}`} 
        className="text-gray-500 hover:text-cedar transition-colors whitespace-nowrap flex-shrink-0"
      >
        {locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home"}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center rtl:flex-row-reverse flex-shrink-0">
          <svg 
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-1.5 sm:mx-2 text-gray-300 rtl:rotate-180 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          {item.href ? (
            <Link 
              href={item.href} 
              className="text-gray-500 hover:text-cedar transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
