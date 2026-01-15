/**
 * Candidate card component with clean modern design (Mobile-responsive)
 */

import Link from "next/link";
import { PlaceholderPhoto } from "@/components/placeholder-photo";
import { StatusBadge } from "@/components/status-badge";
import { getLocalized } from "@daleel/shared";
import type { Locale } from "@daleel/shared";
import { cn } from "@daleel/shared";

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
      className={cn("block group w-full", className)}
    >
      <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:border-cedar/20 active:scale-[0.98] h-full shadow-sm">
        <div className="flex flex-col items-center text-center">
          {/* Photo */}
          <div className="mb-2 sm:mb-3 relative">
            <PlaceholderPhoto
              style={candidate.placeholderPhotoStyle as any}
              seed={candidate.id}
              size={80}
              className="rounded-xl shadow-sm group-hover:shadow-md transition-shadow sm:w-[100px] sm:h-[100px]"
            />
          </div>

          {/* Name */}
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-tight line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center group-hover:text-cedar transition-colors">
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
          <div className="mb-1.5 sm:mb-2">
            <StatusBadge status={candidate.status as any} />
          </div>

          {/* District & List Info */}
          <div className="space-y-0.5 sm:space-y-1 w-full">
            {candidate.district && (
              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
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
              <p className="text-[10px] sm:text-xs text-gray-400 line-clamp-1">
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
