/**
 * Loading state component
 */

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
    <div className={`text-center py-12 ${className}`}>
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500">{message || defaultMessage}</p>
    </div>
  );
}

