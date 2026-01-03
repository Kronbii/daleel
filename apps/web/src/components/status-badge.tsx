/**
 * Status badge component
 */

import { Badge } from "@daleel/ui";
import { STATUS_COLORS } from "@daleel/core";
import type { CandidateStatus, ListStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: CandidateStatus | ListStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorMap: Record<string, "default" | "secondary" | "success" | "warning" | "danger" | "info"> = {
    POTENTIAL: "secondary",
    OFFICIAL: "info",
    WITHDRAWN: "warning",
    DISQUALIFIED: "danger",
    DRAFT: "secondary",
    ANNOUNCED: "info",
    OFFICIAL_LIST: "success",
    WITHDRAWN_LIST: "warning",
  };

  return <Badge variant={colorMap[status] || "default"} className={className}>{status}</Badge>;
}

