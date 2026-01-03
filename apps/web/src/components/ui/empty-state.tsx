/**
 * Empty state component for when no data is found
 */

"use client";

import { useLocale } from "next-intl";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  const locale = useLocale();

  const defaultMessage =
    locale === "ar"
      ? "لا توجد بيانات"
      : locale === "fr"
        ? "Aucune donnée"
        : "No data found";

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-12 text-center ${className}`}>
      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
      <p className="text-gray-500">{message || defaultMessage}</p>
    </div>
  );
}
