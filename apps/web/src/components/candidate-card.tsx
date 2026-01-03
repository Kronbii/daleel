/**
 * Candidate card component with glassmorphism style
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@daleel/ui";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/core";
import type { Locale } from "@daleel/core";
import { cn } from "@daleel/ui";

interface CandidateCardProps {
  candidate: {
    id: string;
    slug: string;
    fullNameAr: string;
    fullNameEn: string;
    fullNameFr: string;
    status: string;
    placeholderPhotoStyle: string;
    district?: {
      nameAr: string;
      nameEn: string;
      nameFr: string;
    } | null;
    currentList?: {
      nameAr: string;
      nameEn: string;
      nameFr: string;
    } | null;
  };
  locale: Locale;
  className?: string;
}

export function CandidateCard({ candidate, locale, className }: CandidateCardProps) {
  return (
    <Link href={`/${locale}/candidates/${candidate.slug}`} className={cn("block", className)}>
      <div className="candidate-card">
        <div className="candidate-card-content">
          <div className="flex flex-col items-center text-center h-full justify-between">
            {/* Photo Section */}
            <div className="flex-shrink-0 mb-4">
              <PlaceholderPhoto
                style={candidate.placeholderPhotoStyle as any}
                seed={candidate.id}
                size={140}
                className="candidate-photo"
              />
            </div>

            {/* Text Content Section */}
            <div className="flex flex-col items-center text-center flex-1 w-full px-2">
              <h3 className="font-bold text-lg mb-3 leading-tight line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                {getLocalized(
                  {
                    ar: candidate.fullNameAr,
                    en: candidate.fullNameEn,
                    fr: candidate.fullNameFr,
                  },
                  locale
                )}
              </h3>
              
              <div className="mb-3">
                <StatusBadge status={candidate.status as any} />
              </div>

              <div className="space-y-1.5 w-full">
                {candidate.district && (
                  <p className="text-sm text-gray-700 font-medium line-clamp-1">
                    {getLocalized(candidate.district, locale)}
                  </p>
                )}
                {candidate.currentList && (
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {getLocalized(candidate.currentList, locale)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

