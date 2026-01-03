/**
 * Shared page layout component
 * Provides consistent structure for all pages
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
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
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
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {description && <p className="text-lg text-gray-600">{description}</p>}
          </div>

          {/* Page Content */}
          {children}
        </div>
      </main>
    </div>
  );
}

