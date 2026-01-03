/**
 * Empty state component for when no data is found
 */

import { useTranslations, useLocale } from "next-intl";

interface EmptyStateProps {
  message?: string;
  icon?: string;
  className?: string;
}

export function EmptyState({ message, icon = "📭", className = "" }: EmptyStateProps) {
  const locale = useLocale();
  const t = useTranslations("common");

  const defaultMessage =
    locale === "ar"
      ? "لا توجد بيانات"
      : locale === "fr"
        ? "Aucune donnée"
        : "No data found";

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 text-lg">{message || defaultMessage}</p>
    </div>
  );
}

