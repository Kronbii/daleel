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
      className={`group inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-500 hover:text-cedar transition-colors px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-cedar/5 active:bg-cedar/10 flex-shrink-0 ${className}`}
    >
      <svg
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200 ${
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
