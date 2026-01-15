/**
 * Unified Link Button Component
 * Styled link that looks like a button, used for CTAs
 */

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@daleel/shared";
import { ArrowRight } from "lucide-react";

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
  className?: string;
  isRTL?: boolean;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  showArrow = false,
  className = "",
  isRTL = false,
}: LinkButtonProps) {
  const baseClasses = "inline-flex items-center gap-2 font-medium transition-all duration-300 rounded-xl";
  
  const variantClasses = {
    primary: "bg-cedar text-white hover:bg-cedar-light shadow-md hover:shadow-lg",
    secondary: "text-cedar hover:bg-cedar/5",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <Link
      href={href}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
      {showArrow && (
        <ArrowRight
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isRTL && "rotate-180"
          )}
        />
      )}
    </Link>
  );
}
