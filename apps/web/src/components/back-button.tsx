"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label, className = "" }: BackButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  const defaultLabel =
    locale === "ar"
      ? "العودة"
      : locale === "fr"
        ? "Retour"
        : "Back";

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors ${className}`}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${
          isRTL
            ? "group-hover:translate-x-0.5 rotate-180"
            : "group-hover:-translate-x-0.5"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
      </svg>
      <span>{label || defaultLabel}</span>
    </button>
  );
}
