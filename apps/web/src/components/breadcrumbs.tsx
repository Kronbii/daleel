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
    <nav className="flex items-center text-sm rtl:flex-row-reverse" aria-label="Breadcrumb">
      <Link 
        href={`/${locale}`} 
        className="text-gray-500 hover:text-emerald-600 transition-colors"
      >
        {locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home"}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center rtl:flex-row-reverse">
          <svg 
            className="w-4 h-4 mx-2 text-gray-300 rtl:rotate-180" 
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
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
