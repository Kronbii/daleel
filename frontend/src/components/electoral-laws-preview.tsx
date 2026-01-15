"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { getLocalizedText, sections } from "@/lib/electoral-laws-content";
import type { Locale } from "@daleel/shared";
import { 
  BookOpen, 
  Clock, 
  Vote, 
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
      color: "bg-blue-500", 
      label: getContent("Timeline", "الجدول الزمني", "Chronologie")
    },
    { 
      icon: BarChart3, 
      color: "bg-emerald-500", 
      label: getContent("PR System", "النظام النسبي", "Système PR")
    },
    { 
      icon: Vote, 
      color: "bg-amber-500", 
      label: getContent("Voting Day", "يوم الانتخاب", "Jour du vote")
    },
    { 
      icon: BarChart3, 
      color: "bg-purple-500", 
      label: getContent("Votes to Seats", "الأصوات والمقاعد", "Voix aux sièges")
    },
    { 
      icon: Scale, 
      color: "bg-red-500", 
      label: getContent("Rules", "القواعد", "Règles")
    },
    { 
      icon: Scale, 
      color: "bg-indigo-500", 
      label: getContent("Rights", "الحقوق", "Droits")
    },
    { 
      icon: HelpCircle, 
      color: "bg-cyan-500", 
      label: getContent("FAQ", "الأسئلة الشائعة", "FAQ")
    },
  ];

  return (
    <section className="container mx-auto px-4 pb-16 sm:pb-20 md:pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cedar to-cedar-light text-white flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900">
              {tCommon("electoralLaws")}
            </h2>
          </div>

          <Link
            href={`/${locale}/electoral-laws`}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-cedar hover:bg-cedar/5 transition-all"
          >
            <span>{getContent("Explore", "استكشف", "Explorer")}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''} group-hover:translate-x-1`}
            />
          </Link>
        </div>

        {/* Visual Preview Card */}
        <Link
          href={`/${locale}/electoral-laws`}
          className="group block relative overflow-hidden rounded-3xl bg-gradient-to-br from-cedar/10 via-white to-cedar/5 border-2 border-cedar/20 hover:border-cedar/40 transition-all duration-500 hover:shadow-2xl hover:shadow-cedar/10"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative p-8 sm:p-12">
            {/* Main Visual Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-8">
              {sectionPreviews.map((preview, index) => {
                const Icon = preview.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <div className={`
                      w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${preview.color} 
                      flex items-center justify-center text-white shadow-lg
                      group-hover:shadow-xl transition-all duration-300
                      group-hover:rotate-3
                    `}>
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium hidden sm:block text-center">
                      {preview.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Visual Elements Row */}
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Timeline Preview */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-cedar"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 hidden sm:inline">
                  {getContent("Timeline", "الجدول الزمني", "Chronologie")}
                </span>
              </div>

              {/* Vote Icon Animation */}
              <motion.div
                className="w-12 h-12 rounded-full bg-cedar/10 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Vote className="w-6 h-6 text-cedar" />
              </motion.div>

              {/* Bar Chart Preview */}
              <div className="flex items-end gap-1 h-12">
                {[0.6, 0.8, 1, 0.7, 0.9].map((height, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-cedar rounded-t"
                    style={{ height: `${height * 100}%` }}
                    animate={{
                      height: [`${height * 100}%`, `${(height * 0.8) * 100}%`, `${height * 100}%`],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Minimal Text CTA */}
            <div className="text-center">
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-cedar text-white rounded-xl font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayCircle className="w-5 h-5" />
                <span className="text-sm sm:text-base">
                  {getContent("Explore Interactive Guide", "استكشف الدليل التفاعلي", "Explorer le guide interactif")}
                </span>
              </motion.div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-cedar border border-cedar/20 shadow-sm"
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
