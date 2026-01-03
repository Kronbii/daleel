/**
 * Shared page layout component
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
    <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
          {/* Breadcrumbs & Back Button */}
          {(breadcrumbs || backHref) && (
            <div className="flex items-center justify-between mb-6">
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              {backHref && <BackButton href={backHref} />}
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-3">{title}</h1>
            {description && (
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed">{description}</p>
            )}
          </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
