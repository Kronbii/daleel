/**
 * Reusable candidates grid component
 */

import { CandidateCard } from "@/components/candidate-card";
import type { Locale } from "@daleel/core";

interface Candidate {
  id: string;
  slug: string;
  fullNameAr: string;
  fullNameEn: string;
  fullNameFr: string;
  status: string;
  placeholderPhotoStyle: string;
  district: {
    nameAr: string;
    nameEn: string;
    nameFr: string;
  };
  currentList?: {
    nameAr: string;
    nameEn: string;
    nameFr: string;
  } | null;
}

interface CandidatesGridProps {
  candidates: Candidate[];
  locale: Locale;
  emptyMessage?: string;
}

export function CandidatesGrid({ candidates, locale, emptyMessage }: CandidatesGridProps) {
  if (candidates.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
        <p className="text-gray-500">{emptyMessage || "No candidates found"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} locale={locale} />
      ))}
    </div>
  );
}
