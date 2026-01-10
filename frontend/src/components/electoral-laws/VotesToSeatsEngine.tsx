"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AltTextToggle } from "./AltTextToggle";
import { AnimationWrapper } from "./AnimationWrapper";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Play, RotateCcw } from "lucide-react";

interface VotesToSeatsEngineProps {
  locale: Locale;
}

// Simulated electoral data
const mockData = {
  totalSeats: 8,
  lists: [
    { id: "A", name: "List A", votes: 4500, color: "#3B82F6", pattern: "solid" },
    { id: "B", name: "List B", votes: 3000, color: "#10B981", pattern: "striped" },
    { id: "C", name: "List C", votes: 1800, color: "#F59E0B", pattern: "dotted" },
    { id: "D", name: "List D", votes: 700, color: "#94A3B8", pattern: "solid" }, // Below threshold
  ],
  totalVotes: 10000,
  threshold: 1000, // Electoral quotient (simplified)
};

interface SeatAllocation {
  listId: string;
  color: string;
  seatIndex: number;
}

export function VotesToSeatsEngine({ locale }: VotesToSeatsEngineProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s4_votes_to_seats;
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState(0); // 0: idle, 1-3: simulation steps
  const [isAnimating, setIsAnimating] = useState(false);
  const [seats, setSeats] = useState<SeatAllocation[]>([]);
  const [eliminatedLists, setEliminatedLists] = useState<string[]>([]);
  const [highlightedBars, setHighlightedBars] = useState<string[]>([]);

  // Calculate proportional seats (simplified for demonstration)
  const calculateSeats = () => {
    const qualifyingLists = mockData.lists.filter(
      (list) => list.votes >= mockData.threshold
    );
    
    const totalQualifyingVotes = qualifyingLists.reduce(
      (sum, list) => sum + list.votes,
      0
    );

    const allocations: SeatAllocation[] = [];
    let seatIndex = 0;

    // First pass: allocate seats based on quotient
    qualifyingLists.forEach((list) => {
      const seatsWon = Math.floor(
        (list.votes / totalQualifyingVotes) * mockData.totalSeats
      );
      for (let i = 0; i < seatsWon; i++) {
        allocations.push({
          listId: list.id,
          color: list.color,
          seatIndex: seatIndex++,
        });
      }
    });

    // Second pass: largest remainder for remaining seats
    const remainingSeats = mockData.totalSeats - allocations.length;
    const remainders = qualifyingLists
      .map((list) => ({
        ...list,
        remainder:
          (list.votes / totalQualifyingVotes) * mockData.totalSeats -
          Math.floor((list.votes / totalQualifyingVotes) * mockData.totalSeats),
      }))
      .sort((a, b) => b.remainder - a.remainder);

    for (let i = 0; i < remainingSeats && i < remainders.length; i++) {
      allocations.push({
        listId: remainders[i].id,
        color: remainders[i].color,
        seatIndex: seatIndex++,
      });
    }

    return allocations;
  };

  // Run simulation
  const runSimulation = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const stepDuration = reducedMotion ? 100 : 1500;

    // Phase 1: Compute threshold (highlight all bars)
    setPhase(1);
    setHighlightedBars(mockData.lists.map((l) => l.id));
    await new Promise((r) => setTimeout(r, stepDuration));

    // Phase 2: Exclude non-qualifying lists
    setPhase(2);
    const eliminated = mockData.lists
      .filter((list) => list.votes < mockData.threshold)
      .map((list) => list.id);
    setEliminatedLists(eliminated);
    setHighlightedBars(
      mockData.lists.filter((l) => l.votes >= mockData.threshold).map((l) => l.id)
    );
    await new Promise((r) => setTimeout(r, stepDuration));

    // Phase 3: Allocate seats
    setPhase(3);
    const allocations = calculateSeats();
    
    // Animate seats one by one
    for (let i = 0; i < allocations.length; i++) {
      await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 200));
      setSeats((prev) => [...prev, allocations[i]]);
    }

    await new Promise((r) => setTimeout(r, stepDuration / 2));
    setIsAnimating(false);
  };

  const resetSimulation = () => {
    setPhase(0);
    setSeats([]);
    setEliminatedLists([]);
    setHighlightedBars([]);
    setIsAnimating(false);
  };

  // Calculate max votes for bar scaling
  const maxVotes = Math.max(...mockData.lists.map((l) => l.votes));

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-2">
            {getLocalizedText(content.title, locale)}
          </h2>
          <p className="text-sm text-gray-500">
            {getLocalizedText(content.tooltip_micro, locale)}
          </p>
        </AnimationWrapper>

        {/* Main Container - Split Screen */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Panel: Vote Bars */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">
                {getLocalizedText(sections.s2_pr_system.labels.list_votes, locale)}
              </h3>

              <div className="space-y-4">
                {mockData.lists.map((list) => {
                  const isEliminated = eliminatedLists.includes(list.id);
                  const isHighlighted = highlightedBars.includes(list.id);
                  const barWidth = (list.votes / maxVotes) * 100;

                  return (
                    <div
                      key={list.id}
                      className={`
                        transition-opacity duration-500
                        ${isEliminated ? "opacity-30" : "opacity-100"}
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {list.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {list.votes.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-lg relative"
                          style={{ backgroundColor: list.color }}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${barWidth}%`,
                            boxShadow: isHighlighted && !isEliminated 
                              ? "0 0 0 2px rgba(0,0,0,0.2)" 
                              : "none"
                          }}
                          transition={{ 
                            duration: reducedMotion ? 0 : 0.8, 
                            ease: "easeOut" 
                          }}
                        />
                        {isEliminated && (
                          <div className="absolute inset-0 flex items-center justify-end pr-2">
                            <span className="text-red-500 font-bold">✗</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Threshold indicator */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{getLocalizedText(sections.s2_pr_system.labels.threshold, locale)}</span>
                  <span>{mockData.threshold.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Seat Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">
                {mockData.totalSeats} {locale === "ar" ? "مقعد" : locale === "fr" ? "sièges" : "Seats"}
              </h3>

              {/* Seat Grid */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: mockData.totalSeats }).map((_, index) => {
                  const seat = seats.find((s) => s.seatIndex === index);
                  
                  return (
                    <motion.div
                      key={index}
                      className={`
                        aspect-square rounded-xl border-2 flex items-center justify-center
                        transition-colors duration-300
                        ${seat 
                          ? "border-transparent" 
                          : "border-dashed border-gray-200 bg-gray-50"
                        }
                      `}
                      style={seat ? { backgroundColor: seat.color } : {}}
                      initial={seat ? { scale: 0 } : {}}
                      animate={seat ? { scale: 1 } : {}}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 20 }
                      }
                    >
                      {seat ? (
                        <span className="text-white font-medium text-sm">
                          {seat.listId}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">{index + 1}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {mockData.lists
                  .filter((l) => !eliminatedLists.includes(l.id))
                  .map((list) => {
                    const seatCount = seats.filter(
                      (s) => s.listId === list.id
                    ).length;
                    return (
                      <div
                        key={list.id}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: list.color }}
                        />
                        <span>
                          {list.name}: {seatCount}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Simulation Steps Indicator */}
          <div className="mt-6">
            <div className="flex justify-center gap-4 mb-4">
              {content.simulate_steps.map((step, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-2 text-xs sm:text-sm
                    transition-all duration-300
                    ${phase === index + 1
                      ? "text-cedar font-medium scale-105"
                      : phase > index + 1
                      ? "text-gray-400"
                      : "text-gray-300"
                    }
                  `}
                >
                  <span
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs border-2
                      ${phase === index + 1
                        ? "border-cedar bg-cedar text-white"
                        : phase > index + 1
                        ? "border-gray-300 bg-gray-100 text-gray-400"
                        : "border-gray-200 text-gray-300"
                      }
                    `}
                  >
                    {phase > index + 1 ? "✓" : index + 1}
                  </span>
                  <span className="hidden sm:inline">{getLocalizedText(step, locale)}</span>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3">
              <button
                onClick={runSimulation}
                disabled={isAnimating}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all
                  ${isAnimating
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-cedar text-white hover:bg-cedar-light shadow-sm hover:shadow-md"
                  }
                `}
              >
                <Play className="w-4 h-4" />
                {t("simulate")}
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                {t("reset")}
              </button>
            </div>
          </div>
        </div>

        {/* Alt text toggle */}
        <div className="mt-8 flex justify-center">
          <AltTextToggle altText={t("altTextEngine")} />
        </div>
      </div>
    </section>
  );
}
