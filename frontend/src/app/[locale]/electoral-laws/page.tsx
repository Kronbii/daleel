/**
 * Electoral Laws Page
 * Educational page explaining Lebanese electoral law (Law No. 44/2017)
 * Visual-first, animation-driven, strictly non-political
 */

import { getTranslations } from "next-intl/server";
import type { Locale } from "@daleel/shared";
import { pageContent, getLocalizedText } from "@/lib/electoral-laws-content";
import { OverviewTimeline } from "@/components/electoral-laws/OverviewTimeline";
import { PRSystemSection } from "@/components/electoral-laws/PRSystemSection";
import { VotingDayCarousel } from "@/components/electoral-laws/VotingDayCarousel";
import { VotesToSeatsEngine } from "@/components/electoral-laws/VotesToSeatsEngine";
import { RulesCardsSection } from "@/components/electoral-laws/RulesCardsSection";
import { RightsDutiesSection } from "@/components/electoral-laws/RightsDutiesSection";
import { FAQSection } from "@/components/electoral-laws/FAQSection";

export default async function ElectoralLawsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("electoralLaws");
  const typedLocale = locale as Locale;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="container mx-auto px-4 pt-8 pb-12 sm:pt-12 sm:pb-16 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-3">
          {t("pageTitle")}
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 font-light">
          {t("pageSubtitle")}
        </p>
        <p className="mt-4 text-sm text-gray-400 max-w-2xl mx-auto">
          {getLocalizedText(pageContent.scope, typedLocale)}
        </p>
      </header>

      {/* Section 1: Overview Timeline */}
      <OverviewTimeline locale={typedLocale} />

      {/* Section 2: Proportional Representation */}
      <PRSystemSection locale={typedLocale} />

      {/* Section 3: Voting Day Step by Step */}
      <VotingDayCarousel locale={typedLocale} />

      {/* Section 4: Votes to Seats */}
      <VotesToSeatsEngine locale={typedLocale} />

      {/* Section 5: Rules Cards */}
      <RulesCardsSection locale={typedLocale} />

      {/* Section 6: Rights & Duties */}
      <RightsDutiesSection locale={typedLocale} />

      {/* Section 7: FAQ */}
      <FAQSection locale={typedLocale} />
    </div>
  );
}
