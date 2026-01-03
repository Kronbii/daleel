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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Main gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #f8faf9 0%, #ffffff 50%, #f0fdf4 100%)",
          }}
        />
        
        {/* Large soft circle - top right */}
        <div 
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
          }}
        />
        
        {/* Medium circle - bottom left */}
        <div 
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <main className="relative container mx-auto px-4 py-8 sm:py-12">
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
      </main>
    </div>
  );
}
