/**
 * Loading state component
 * Unified design system styling
 */

"use client";

import { useLocale } from "next-intl";
import { SectionCard } from "./section-card";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message, className = "" }: LoadingStateProps) {
  const locale = useLocale();

  const defaultMessage =
    locale === "ar"
      ? "جاري التحميل..."
      : locale === "fr"
        ? "Chargement..."
        : "Loading...";

  return (
    <SectionCard variant="default" className={`p-12 text-center ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-cedar mb-4"></div>
        <p className="text-sm sm:text-base text-gray-600">{message || defaultMessage}</p>
      </div>
    </SectionCard>
  );
}
