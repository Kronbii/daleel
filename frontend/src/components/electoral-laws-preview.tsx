"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { getLocalizedText, sections } from "@/lib/electoral-laws-content";
import type { Locale } from "@daleel/shared";
import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  Scale, 
  HelpCircle,
  ArrowRight,
  PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface ElectoralLawsPreviewProps {
  locale: Locale;
}

export default function ElectoralLawsPreview({ locale }: ElectoralLawsPreviewProps) {
  const t = useTranslations("electoralLaws");
  const tCommon = useTranslations("common");
  const isRTL = locale === "ar";

  const getContent = (en: string, ar: string, fr: string) => {
    if (locale === "ar") return ar;
    if (locale === "fr") return fr;
    return en;
  };

  // Visual preview icons for each section with short, concise labels
  const sectionPreviews = [
    { 
      icon: Clock, 
      color: "bg-cedar", 
      label: getContent("Timeline", "الجدول الزمني", "Chronologie")
    },
    { 
      icon: BarChart3, 
      color: "bg-cedar", 
      label: getContent("PR System", "النظام النسبي", "Système PR")
    },
    { 
      icon: BarChart3, 
      color: "bg-cedar", 
      label: getContent("Votes to Seats", "الأصوات والمقاعد", "Voix aux sièges")
    },
    { 
      icon: Scale, 
      color: "bg-cedar", 
      label: getContent("Rules", "القواعد", "Règles")
    },
    { 
      icon: Scale, 
      color: "bg-cedar", 
      label: getContent("Rights", "الحقوق", "Droits")
    },
    { 
      icon: HelpCircle, 
      color: "bg-cedar", 
      label: getContent("FAQ", "الأسئلة الشائعة", "FAQ")
    },
  ];

  return (
    <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cedar to-cedar-light text-white flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-medium text-gray-900">
              {tCommon("electoralLaws")}
            </h2>
          </div>

          <Link
            href={`/${locale}/electoral-laws`}
            className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-cedar hover:bg-cedar/5 transition-all"
          >
            <span className="hidden sm:inline">{getContent("Explore", "استكشف", "Explorer")}</span>
            <span className="sm:hidden">{getContent("View", "عرض", "Voir")}</span>
            <ArrowRight
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1`}
            />
          </Link>
        </div>

        {/* Visual Preview Card */}
        <Link
          href={`/${locale}/electoral-laws`}
          className="group block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cedar/10 via-white to-cedar/5 border-2 border-cedar/20 hover:border-cedar/40 transition-all duration-500 hover:shadow-2xl hover:shadow-cedar/10"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Main Visual Grid - Better responsive layout for 6 items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {sectionPreviews.map((preview, index) => {
                const Icon = preview.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-2 sm:gap-1.5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div 
                      className={`
                        rounded-xl sm:rounded-2xl bg-white border-2 border-cedar/20
                        flex items-center justify-center text-cedar shadow-lg
                        group-hover:shadow-xl group-hover:border-cedar/40 transition-all duration-300
                        group-hover:rotate-3
                      `}
                      style={{
                        width: 'clamp(3rem, 4vw + 2rem, 5rem)',
                        height: 'clamp(3rem, 4vw + 2rem, 5rem)',
                      }}
                    >
                      <Icon 
                        style={{
                          width: 'clamp(1.5rem, 2.5vw + 1rem, 2.5rem)',
                          height: 'clamp(1.5rem, 2.5vw + 1rem, 2.5rem)',
                        }}
                      />
                    </div>
                    <span className="text-xs sm:text-xs text-gray-600 sm:text-gray-500 font-medium text-center leading-tight px-1 sm:px-1">
                      {preview.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Minimal Text CTA */}
            <div className="text-center">
              <motion.div
                className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-cedar text-white rounded-lg sm:rounded-xl font-medium shadow-lg text-xs sm:text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  <span className="hidden sm:inline">
                    {getContent("Explore Interactive Guide", "استكشف الدليل التفاعلي", "Explorer le guide interactif")}
                  </span>
                  <span className="sm:hidden">
                    {getContent("Explore Guide", "استكشف الدليل", "Explorer")}
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Floating Badge - Better mobile positioning */}
            <motion.div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold text-cedar border border-cedar/20 shadow-sm"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {getContent("Law 44/2017", "قانون 44/2017", "Loi 44/2017")}
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  );
}
