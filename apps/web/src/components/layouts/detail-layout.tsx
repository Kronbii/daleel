/**
 * Shared detail page layout component
 * For individual item detail pages (candidate, district, list)
 */

import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";
import { Card } from "@daleel/ui";

interface DetailLayoutProps {
  title: string;
  subtitle?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <main className="container mx-auto px-4 py-12">
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{title}</h1>
                {subtitle && <p className="text-lg text-gray-600 mb-4">{subtitle}</p>}
              </div>
              {headerActions && <div>{headerActions}</div>}
            </div>
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

