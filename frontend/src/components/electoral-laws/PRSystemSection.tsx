"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AltTextToggle } from "./AltTextToggle";
import { AnimationWrapper } from "./AnimationWrapper";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface PRSystemSectionProps {
  locale: Locale;
}

// Simulated list data for the marble animation
const mockLists = [
  { id: "A", votes: 45, color: "#3B82F6" }, // Blue
  { id: "B", votes: 30, color: "#10B981" }, // Green  
  { id: "C", votes: 15, color: "#F59E0B" }, // Amber
  { id: "D", votes: 10, color: "#EF4444" }, // Red (below threshold)
];

const THRESHOLD = 20; // Qualifying threshold percentage
const TOTAL_MARBLES = 20;

interface Marble {
  id: number;
  listId: string;
  color: string;
  x: number;
  delay: number;
}

export function PRSystemSection({ locale }: PRSystemSectionProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s2_pr_system;
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();

  const [isAnimating, setIsAnimating] = useState(false);
  const [phase, setPhase] = useState<"idle" | "dropping" | "threshold" | "complete">("idle");
  const [marbles, setMarbles] = useState<Marble[]>([]);
  const [eliminatedLists, setEliminatedLists] = useState<string[]>([]);

  // Generate marbles based on vote distribution
  const generateMarbles = () => {
    const newMarbles: Marble[] = [];
    let marbleId = 0;

    mockLists.forEach((list) => {
      const marbleCount = Math.round((list.votes / 100) * TOTAL_MARBLES);
      for (let i = 0; i < marbleCount; i++) {
        newMarbles.push({
          id: marbleId++,
          listId: list.id,
          color: list.color,
          x: Math.random() * 80 + 10, // Random x position
          delay: Math.random() * 2, // Random delay for staggered drop
        });
      }
    });

    return newMarbles;
  };

  // Start the animation sequence
  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPhase("dropping");
    setMarbles(generateMarbles());
    setEliminatedLists([]);

    // Phase 2: Show threshold after marbles drop
    setTimeout(() => {
      setPhase("threshold");
    }, reducedMotion ? 100 : 3000);

    // Phase 3: Eliminate lists below threshold
    setTimeout(() => {
      const eliminated = mockLists
        .filter((list) => list.votes < THRESHOLD)
        .map((list) => list.id);
      setEliminatedLists(eliminated);
      setPhase("complete");
    }, reducedMotion ? 200 : 4500);

    // Reset
    setTimeout(() => {
      setIsAnimating(false);
    }, reducedMotion ? 300 : 6000);
  };

  const resetAnimation = () => {
    setPhase("idle");
    setMarbles([]);
    setEliminatedLists([]);
    setIsAnimating(false);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>
        </AnimationWrapper>

        {/* Animation Container */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {/* Vote Bucket (Container for marbles) */}
            <div className="relative h-64 mb-6">
              {/* Bucket outline */}
              <div className="absolute inset-x-4 bottom-0 h-48 border-2 border-gray-200 rounded-b-3xl bg-gray-50/50">
                {/* List columns */}
                <div className="absolute inset-0 flex">
                  {mockLists.map((list, index) => {
                    const isEliminated = eliminatedLists.includes(list.id);
                    return (
                      <div
                        key={list.id}
                        className={`
                          flex-1 border-r last:border-r-0 border-gray-200 
                          relative overflow-hidden transition-opacity duration-500
                          ${isEliminated ? "opacity-30" : "opacity-100"}
                        `}
                      >
                        {/* List label */}
                        <div 
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${list.color}20`, color: list.color }}
                        >
                          {getLocalizedText(content.labels.list_votes, locale)} {list.id}
                        </div>

                        {/* Marbles in this column */}
                        <AnimatePresence>
                          {marbles
                            .filter((m) => m.listId === list.id)
                            .map((marble, mIndex) => (
                              <motion.div
                                key={marble.id}
                                className="absolute w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: marble.color }}
                                initial={{ 
                                  top: -20, 
                                  left: `${30 + (mIndex % 3) * 20}%`,
                                  opacity: 0 
                                }}
                                animate={
                                  phase !== "idle"
                                    ? {
                                        top: `${65 - (mIndex * 12)}%`,
                                        opacity: isEliminated && phase === "complete" ? 0.3 : 1,
                                      }
                                    : {}
                                }
                                transition={
                                  reducedMotion
                                    ? { duration: 0 }
                                    : {
                                        delay: marble.delay,
                                        duration: 0.8,
                                        type: "spring",
                                        bounce: 0.4,
                                      }
                                }
                              />
                            ))}
                        </AnimatePresence>

                        {/* Trap door for eliminated lists */}
                        {isEliminated && phase === "complete" && (
                          <motion.div
                            className="absolute bottom-0 inset-x-0 h-8 bg-red-100 border-t-2 border-red-300 flex items-center justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reducedMotion ? 0 : 0.3 }}
                          >
                            <span className="text-xs text-red-600 font-medium">✗</span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Threshold Line */}
              <motion.div
                className="absolute left-4 right-4 h-0.5 bg-cedar flex items-center"
                style={{ bottom: "35%" }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={
                  phase === "threshold" || phase === "complete"
                    ? { opacity: 1, scaleX: 1 }
                    : {}
                }
                transition={{ duration: reducedMotion ? 0 : 0.5 }}
              >
                <span 
                  className={`
                    absolute ${isRTL ? "right-full mr-2" : "left-full ml-2"} 
                    whitespace-nowrap text-xs font-medium text-cedar bg-white px-2 py-1 rounded shadow-sm
                  `}
                >
                  {getLocalizedText(content.labels.threshold, locale)}
                </span>
              </motion.div>

              {/* Total Votes Label */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                {getLocalizedText(content.labels.total_votes, locale)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className={`
                  px-6 py-2.5 rounded-xl font-medium text-sm transition-all
                  ${isAnimating
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-cedar text-white hover:bg-cedar-light shadow-sm hover:shadow-md"
                  }
                `}
              >
                {t("simulate")}
              </button>
              <button
                onClick={resetAnimation}
                className="px-6 py-2.5 rounded-xl font-medium text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                {t("reset")}
              </button>
            </div>

            {/* Phase indicator */}
            {phase !== "idle" && (
              <motion.div
                className="mt-4 text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {phase === "dropping" && "..."}
                {phase === "threshold" && getLocalizedText(content.labels.threshold, locale)}
                {phase === "complete" && "✓"}
              </motion.div>
            )}
          </div>

          {/* Legend - Color blind safe with patterns */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {mockLists.map((list) => {
              const isEliminated = eliminatedLists.includes(list.id);
              return (
                <div
                  key={list.id}
                  className={`
                    flex items-center gap-2 text-sm
                    ${isEliminated ? "opacity-50 line-through" : ""}
                  `}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ 
                      backgroundColor: list.color,
                      borderColor: list.color,
                    }}
                  />
                  <span>{list.votes}%</span>
                  {isEliminated && (
                    <span className="text-red-500 text-xs">(✗)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Alt text toggle */}
        <div className="mt-8 flex justify-center">
          <AltTextToggle altText={t("altTextPR")} />
        </div>
      </div>
    </section>
  );
}
