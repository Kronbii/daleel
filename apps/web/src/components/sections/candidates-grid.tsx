/**
 * Reusable candidates grid component
 */

import { CandidateCard } from "@/components/candidate-card";
import { EmptyState } from "@/components/ui/empty-state";
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
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 justify-items-center">
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} locale={locale} />
      ))}
    </div>
  );
}

