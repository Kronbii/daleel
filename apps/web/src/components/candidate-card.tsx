/**
 * Candidate card component with clean modern design
 */

import Link from "next/link";
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
    <Link 
      href={`/${locale}/candidates/${candidate.slug}`} 
      className={cn("block group w-full max-w-[200px]", className)}
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 h-full">
        <div className="flex flex-col items-center text-center">
          {/* Photo */}
          <div className="mb-3 relative">
              <PlaceholderPhoto
                style={candidate.placeholderPhotoStyle as any}
                seed={candidate.id}
              size={100}
              className="rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
              />
            </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center group-hover:text-emerald-600 transition-colors">
                {getLocalized(
                  {
                    ar: candidate.fullNameAr,
                    en: candidate.fullNameEn,
                    fr: candidate.fullNameFr,
                  },
                  locale
                )}
              </h3>
              
          {/* Status Badge */}
          <div className="mb-2">
                <StatusBadge status={candidate.status as any} />
              </div>

          {/* District & List Info */}
          <div className="space-y-1 w-full">
                {candidate.district && (
              <p className="text-xs text-gray-500 line-clamp-1">
                {getLocalized(
                  {
                    ar: candidate.district.nameAr,
                    en: candidate.district.nameEn,
                    fr: candidate.district.nameFr,
                  },
                  locale
                )}
                  </p>
                )}
                {candidate.currentList && (
              <p className="text-xs text-gray-400 line-clamp-1">
                {getLocalized(
                  {
                    ar: candidate.currentList.nameAr,
                    en: candidate.currentList.nameEn,
                    fr: candidate.currentList.nameFr,
                  },
                  locale
                )}
                  </p>
                )}
          </div>
        </div>
      </div>
    </Link>
  );
}
