/**
 * Unified Section Header Component
 * Used across all pages for consistent section headers
 */

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  /** Icon component from lucide-react */
  icon: LucideIcon;
  /** Section title */
  title: string;
  /** Optional action element (e.g., "View all" link) */
  action?: ReactNode;
  /** Optional description text */
  description?: string;
  /** Additional className */
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  action,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-8 ${className}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cedar to-cedar-light text-white flex items-center justify-center shadow-lg">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
