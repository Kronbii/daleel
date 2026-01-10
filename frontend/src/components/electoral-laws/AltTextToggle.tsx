"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

interface AltTextToggleProps {
  altText: string;
  className?: string;
}

/**
 * Accessibility component that provides a toggle to show/hide
 * a text description of visual content for screen readers and
 * users who prefer text descriptions.
 */
export function AltTextToggle({ altText, className = "" }: AltTextToggleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("electoralLaws");

  return (
    <div className={`${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cedar focus:ring-offset-2"
        aria-expanded={isVisible}
        aria-controls="alt-text-content"
      >
        {isVisible ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span>{t("hideAltText")}</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span>{t("showAltText")}</span>
          </>
        )}
      </button>
      
      {isVisible && (
        <div
          id="alt-text-content"
          className="mt-3 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100"
          role="region"
          aria-live="polite"
        >
          {altText}
        </div>
      )}
    </div>
  );
}
