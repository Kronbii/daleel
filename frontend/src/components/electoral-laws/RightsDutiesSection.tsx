"use client";

import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AltTextToggle } from "./AltTextToggle";
import { AnimationWrapper } from "./AnimationWrapper";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import {
  Shield,
  User,
  HeartHandshake,
  DoorClosed,
  EyeOff,
  Scale,
  Check,
  AlertCircle,
} from "lucide-react";

interface RightsDutiesSectionProps {
  locale: Locale;
}

// Icons for rights
const rightIcons = [Shield, User, HeartHandshake];

// Icons for duties
const dutyIcons = [DoorClosed, EyeOff, Scale];

export function RightsDutiesSection({ locale }: RightsDutiesSectionProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s6_rights_duties;
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation variants for items sliding in from edges
  const leftItemVariants = {
    hidden: { opacity: 0, x: isRTL ? 50 : -50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: reducedMotion ? 0 : i * 0.15,
        duration: reducedMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  const rightItemVariants = {
    hidden: { opacity: 0, x: isRTL ? -50 : 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: reducedMotion ? 0 : i * 0.15,
        duration: reducedMotion ? 0 : 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>
        </AnimationWrapper>

        {/* Split Screen Wall */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 md:gap-0">
            {/* Rights Column */}
            <div className="md:border-r border-gray-200 md:pr-8">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-emerald-700">
                  {t("rights")}
                </h3>
              </div>

              <div className="space-y-4">
                {content.rights.map((right, index) => {
                  const Icon = rightIcons[index] || Shield;
                  return (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={leftItemVariants}
                      initial="hidden"
                      animate={isVisible ? "visible" : "hidden"}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <span className="text-gray-800 font-medium">
                        {getLocalizedText(right, locale)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Duties Column */}
            <div className="md:pl-8">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-amber-700">
                  {t("duties")}
                </h3>
              </div>

              <div className="space-y-4">
                {content.duties.map((duty, index) => {
                  const Icon = dutyIcons[index] || Scale;
                  return (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={rightItemVariants}
                      initial="hidden"
                      animate={isVisible ? "visible" : "hidden"}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <span className="text-gray-800 font-medium">
                        {getLocalizedText(duty, locale)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Alt text toggle */}
        <div className="mt-10 flex justify-center">
          <AltTextToggle altText={t("altTextRights")} />
        </div>
      </div>
    </section>
  );
}
