/**
 * Shared page layout component (Mobile-responsive)
 * Provides consistent structure for all pages with modern design
 */

import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";

interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  backHref?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "7xl" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

export function PageLayout({
  title,
  description,
  breadcrumbs,
  backHref,
  children,
  maxWidth = "7xl",
  className = "",
}: PageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-5 sm:py-8 md:py-12">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
        {/* Breadcrumbs & Back Button */}
        {(breadcrumbs || backHref) && (
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {backHref && <BackButton href={backHref} />}
          </div>
        )}

        {/* Page Header */}
        <div className="mb-5 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-gray-900 mb-2 sm:mb-3">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
