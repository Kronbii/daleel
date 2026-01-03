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
    <nav className="flex items-center space-x-2 text-sm text-gray-600 rtl:space-x-reverse mb-4" aria-label="Breadcrumb">
      <Link href={`/${locale}`} className="hover:text-gray-900">
        {locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home"}
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          <span className="mx-2">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-900">
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

