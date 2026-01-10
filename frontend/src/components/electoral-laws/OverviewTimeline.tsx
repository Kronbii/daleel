"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AltTextToggle } from "./AltTextToggle";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { 
  ClipboardList, 
  Megaphone, 
  Vote, 
  Calculator, 
  Trophy 
} from "lucide-react";

interface OverviewTimelineProps {
  locale: Locale;
}

const milestoneIcons = [
  ClipboardList, // registration
  Megaphone,     // campaign
  Vote,          // election_day
  Calculator,    // counting
  Trophy,        // results
];

export function OverviewTimeline({ locale }: OverviewTimelineProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s1_overview_timeline;
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which milestone is in view using IntersectionObserver
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observers: IntersectionObserver[] = [];

    milestoneRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        {
          root: container,
          threshold: 0.6,
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Calculate voter icon position based on active milestone
  const voterPosition = `${(activeIndex / (content.milestones.length - 1)) * 100}%`;

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 text-center mb-8">
          {getLocalizedText(content.title, locale)}
        </h2>

        {/* Voter Icon - Animated along the timeline */}
        <div className="relative max-w-4xl mx-auto mb-4">
          <div className="h-12 relative">
            <motion.div
              className="absolute top-0 z-10"
              style={{
                [isRTL ? "right" : "left"]: voterPosition,
                transform: `translateX(${isRTL ? "50%" : "-50%"})`,
              }}
              animate={{
                [isRTL ? "right" : "left"]: voterPosition,
              }}
              transition={reducedMotion ? { duration: 0 } : { 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              }}
            >
              <div className={`flex flex-col items-center ${isRTL ? "scale-x-[-1]" : ""}`}>
                {/* Voter icon */}
                <svg
                  className="w-10 h-10 text-cedar"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
              </div>
            </motion.div>
            
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
            <motion.div
              className="absolute top-1/2 h-0.5 bg-cedar -translate-y-1/2"
              style={{
                [isRTL ? "right" : "left"]: 0,
                width: voterPosition,
              }}
              animate={{
                width: voterPosition,
              }}
              transition={reducedMotion ? { duration: 0 } : { 
                type: "spring", 
                stiffness: 100, 
                damping: 20 
              }}
            />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-4 px-4 -mx-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {content.milestones.map((milestone, index) => {
            const Icon = milestoneIcons[index];
            const isActive = index === activeIndex;

            return (
              <div
                key={milestone.key}
                ref={(el) => {
                  milestoneRefs.current[index] = el;
                }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-center"
              >
                <motion.div
                  className={`
                    h-full p-6 rounded-2xl border transition-all duration-300
                    ${isActive 
                      ? "bg-white border-cedar/30 shadow-lg shadow-cedar/5" 
                      : "bg-white/50 border-gray-100 hover:border-gray-200"
                    }
                  `}
                  initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step number and icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isActive ? "bg-cedar text-white" : "bg-gray-100 text-gray-500"}
                      transition-colors duration-300
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`
                      text-sm font-medium
                      ${isActive ? "text-cedar" : "text-gray-400"}
                    `}>
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className={`
                    text-lg font-medium mb-2
                    ${isActive ? "text-gray-900" : "text-gray-700"}
                  `}>
                    {getLocalizedText(milestone.label, locale)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {getLocalizedText(milestone.micro, locale)}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators for mobile */}
        <div className="flex justify-center gap-2 mt-4">
          {content.milestones.map((_, index) => (
            <button
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === activeIndex 
                  ? "bg-cedar w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
                }
              `}
              onClick={() => {
                milestoneRefs.current[index]?.scrollIntoView({
                  behavior: reducedMotion ? "auto" : "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Alt text toggle */}
        <div className="mt-6 flex justify-center">
          <AltTextToggle altText={t("altTextTimeline")} />
        </div>
      </div>
    </section>
  );
}
