/**
 * Unified Section Card Component
 * Provides consistent card styling across the site
 */

import { ReactNode } from "react";
import { cn } from "@daleel/shared";
import Link from "next/link";

interface SectionCardProps {
  children: ReactNode;
  /** Card variant */
  variant?: "default" | "gradient" | "bordered";
  /** Hover effect */
  hover?: boolean;
  /** Additional className */
  className?: string;
  /** Click handler (makes card clickable) */
  onClick?: () => void;
  /** Link href (makes card a link) */
  href?: string;
}

export function SectionCard({
  children,
  variant = "default",
  hover = false,
  className = "",
  onClick,
  href,
}: SectionCardProps) {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white border border-gray-100 shadow-sm",
    gradient: "bg-gradient-to-br from-cedar/5 via-white to-cedar/5 border border-cedar/10 shadow-sm",
    bordered: "bg-white border-2 border-gray-200 shadow-sm",
  };

  const hoverClasses = hover
    ? "hover:shadow-md hover:border-cedar/20 cursor-pointer"
    : "";

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    className
  );

  const content = (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

// Utility function for card padding
export const cardPadding = "p-6 sm:p-8";
