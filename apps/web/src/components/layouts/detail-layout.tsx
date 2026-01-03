/**
 * Shared detail page layout component (Mobile-responsive)
 * For individual item detail pages (candidate, district, list)
 */

import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";

interface DetailLayoutProps {
  title: string;
  subtitle?: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  backHref?: string;
  headerActions?: ReactNode;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl";
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
};

export function DetailLayout({
  title,
  subtitle,
  breadcrumbs,
  backHref,
  headerActions,
  children,
  maxWidth = "6xl",
  className = "",
}: DetailLayoutProps) {
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900 mb-1 sm:mb-2 break-words">{title}</h1>
              {subtitle && <div className="text-sm sm:text-base md:text-lg text-gray-500">{subtitle}</div>}
            </div>
            {headerActions && <div className="flex-shrink-0">{headerActions}</div>}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
