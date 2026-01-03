/**
 * Reusable page header component
 */

import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BackButton } from "@/components/back-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  backHref?: string;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  actions,
}: PageHeaderProps) {
  return (
    <>
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
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            {description && <p className="text-lg text-gray-600">{description}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
    </>
  );
}

