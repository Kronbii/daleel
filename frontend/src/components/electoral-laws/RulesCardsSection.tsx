"use client";

import { useTranslations } from "next-intl";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { FlippableCard } from "./FlippableCard";
import { AltTextToggle } from "./AltTextToggle";
import { AnimationWrapper, StaggerContainer, StaggerItem } from "./AnimationWrapper";
import { Camera, Megaphone, HeartHandshake, Check, X } from "lucide-react";

interface RulesCardsSectionProps {
  locale: Locale;
}

// Icons for each rule card
const ruleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  secrecy_photo: Camera,
  inside_center_campaign: Megaphone,
  ask_help_disability: HeartHandshake,
};

// Determine if a verdict is "allowed" based on content
const isAllowedVerdict = (verdictEn: string): boolean => {
  const lower = verdictEn.toLowerCase();
  return lower.includes("allowed") && !lower.includes("not allowed");
};

export function RulesCardsSection({ locale }: RulesCardsSectionProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s5_rules_cards;

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>
          <p className="text-sm text-gray-500">
            {t("flipCard")}
          </p>
        </AnimationWrapper>

        {/* Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
          whileInView
          staggerDelay={0.15}
        >
          {content.starter_deck.map((rule) => {
            const Icon = ruleIcons[rule.key] || Camera;
            const isAllowed = isAllowedVerdict(rule.verdict.en);

            return (
              <StaggerItem key={rule.key}>
                <FlippableCard
                  className="h-48"
                  isAllowed={isAllowed}
                  ariaLabel={`${getLocalizedText(rule.action, locale)} - ${t("flipCard")}`}
                  frontContent={
                    <>
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <Icon className="w-7 h-7 text-gray-600" />
                      </div>
                      <span className="text-base font-medium text-gray-800 text-center">
                        {getLocalizedText(rule.action, locale)}
                      </span>
                    </>
                  }
                  backContent={
                    <>
                      {/* Large icon indicator - color blind safe with shapes */}
                      <div
                        className={`
                          w-16 h-16 rounded-full flex items-center justify-center mb-3
                          ${isAllowed 
                            ? "bg-emerald-500 text-white" 
                            : "bg-red-500 text-white"
                          }
                        `}
                      >
                        {isAllowed ? (
                          <Check className="w-8 h-8" strokeWidth={3} />
                        ) : (
                          <X className="w-8 h-8" strokeWidth={3} />
                        )}
                      </div>
                      
                      {/* Verdict text */}
                      <span
                        className={`
                          text-lg font-semibold text-center
                          ${isAllowed ? "text-emerald-700" : "text-red-700"}
                        `}
                      >
                        {getLocalizedText(rule.verdict, locale)}
                      </span>

                      {/* Accessible text indicator */}
                      <span className="sr-only">
                        {isAllowed ? t("allowed") : t("notAllowed")}
                      </span>
                    </>
                  }
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Alt text toggle */}
        <div className="mt-10 flex justify-center">
          <AltTextToggle altText={t("altTextRules")} />
        </div>
      </div>
    </section>
  );
}
