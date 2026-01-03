/**
 * Status badge component with clean styling
 */

import type { CandidateStatus, ListStatus } from "@prisma/client";
import { cn } from "@daleel/ui";

interface StatusBadgeProps {
  status: CandidateStatus | ListStatus;
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; label?: Record<string, string> }> = {
  POTENTIAL: { 
    bg: "bg-gray-100", 
    text: "text-gray-600",
    label: { en: "Potential", ar: "محتمل", fr: "Potentiel" }
  },
  OFFICIAL: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-700",
    label: { en: "Official", ar: "رسمي", fr: "Officiel" }
  },
  WITHDRAWN: { 
    bg: "bg-amber-50", 
    text: "text-amber-700",
    label: { en: "Withdrawn", ar: "منسحب", fr: "Retiré" }
  },
  DISQUALIFIED: { 
    bg: "bg-red-50", 
    text: "text-red-700",
    label: { en: "Disqualified", ar: "مستبعد", fr: "Disqualifié" }
  },
  DRAFT: { 
    bg: "bg-gray-100", 
    text: "text-gray-600",
    label: { en: "Draft", ar: "مسودة", fr: "Brouillon" }
  },
  ANNOUNCED: { 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    label: { en: "Announced", ar: "معلن", fr: "Annoncé" }
  },
  OFFICIAL_LIST: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-700",
    label: { en: "Official", ar: "رسمي", fr: "Officiel" }
  },
  WITHDRAWN_LIST: { 
    bg: "bg-amber-50", 
    text: "text-amber-700",
    label: { en: "Withdrawn", ar: "منسحب", fr: "Retiré" }
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = statusStyles[status] || { bg: "bg-gray-100", text: "text-gray-600" };
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      {status.replace("_LIST", "")}
    </span>
  );
}
