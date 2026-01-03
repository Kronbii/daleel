"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@daleel/ui";

interface BackButtonProps {
  href?: string;
  label?: string;
  variant?: "default" | "ghost" | "link" | "outline";
  className?: string;
}

export function BackButton({ href, label, variant = "ghost", className = "" }: BackButtonProps) {
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
    <Button
      variant={variant}
      onClick={handleClick}
      className={`group flex items-center gap-2 ${className}`}
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${
          isRTL
            ? "group-hover:translate-x-1"
            : "group-hover:-translate-x-1"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isRTL ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        )}
      </svg>
      <span>{label || defaultLabel}</span>
    </Button>
  );
}

