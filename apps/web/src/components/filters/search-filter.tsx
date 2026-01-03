"use client";

import { useLocale } from "next-intl";

interface SearchFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchFilter({ value, onChange, placeholder, className = "" }: SearchFilterProps) {
  const locale = useLocale();

  const defaultPlaceholder =
    locale === "ar"
      ? "ابحث..."
      : locale === "fr"
        ? "Rechercher..."
        : "Search...";

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || defaultPlaceholder}
        className="w-full px-3 sm:px-4 py-2.5 pl-10 sm:pl-11 rtl:pl-3 rtl:sm:pl-4 rtl:pr-10 rtl:sm:pr-11 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 hover:border-emerald-300 hover:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white"
      />
      <div className="absolute left-3 sm:left-4 rtl:left-auto rtl:right-3 rtl:sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 sm:right-3 rtl:right-auto rtl:left-2 rtl:sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-emerald-50 active:bg-emerald-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
