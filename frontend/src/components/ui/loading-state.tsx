/**
 * Loading state component
 */

"use client";

import { useLocale } from "next-intl";

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
    <div className={`bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-12 text-center ${className}`}>
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-emerald-600 mb-4"></div>
      <p className="text-gray-500">{message || defaultMessage}</p>
    </div>
  );
}
