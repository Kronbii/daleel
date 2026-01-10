"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AltTextToggle } from "./AltTextToggle";
import { AnimationWrapper } from "./AnimationWrapper";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { 
  CreditCard, 
  FileText, 
  DoorOpen, 
  Inbox, 
  PenLine,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface VotingDayCarouselProps {
  locale: Locale;
}

const cardIcons = [
  CreditCard,  // id_check
  FileText,    // receive_ballot
  DoorOpen,    // behind_booth
  Inbox,       // cast_ballot
  PenLine,     // ink_signature
];

export function VotingDayCarousel({ locale }: VotingDayCarouselProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s3_voting_day;
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalCards = content.cards.length;

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalCards]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToIndex = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    // In RTL mode, swipe directions are reversed
    if (isRTL) {
      if (diff < -threshold) goToNext();
      else if (diff > threshold) goToPrev();
    } else {
      if (diff > threshold) goToNext();
      else if (diff < -threshold) goToPrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        isRTL ? goToPrev() : goToNext();
      } else if (e.key === "ArrowLeft") {
        isRTL ? goToNext() : goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, isRTL]);

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isRTL ? -300 : 300) : (isRTL ? 300 : -300),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? (isRTL ? -300 : 300) : (isRTL ? 300 : -300),
      opacity: 0,
    }),
  };

  const currentCard = content.cards[currentIndex];
  const CurrentIcon = cardIcons[currentIndex];

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>
        </AnimationWrapper>

        {/* Carousel Container */}
        <div className="max-w-md mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-sm text-gray-500">
              {t("stepOf", { current: currentIndex + 1, total: totalCards })}
            </span>
          </div>

          {/* Card Container */}
          <div
            className="relative overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-roledescription="carousel"
            aria-label={getLocalizedText(content.title, locale)}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={reducedMotion ? {} : slideVariants}
                initial={reducedMotion ? {} : "enter"}
                animate="center"
                exit={reducedMotion ? {} : "exit"}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }
                }
                className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8"
                role="group"
                aria-roledescription="slide"
                aria-label={`${currentIndex + 1} of ${totalCards}`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-cedar/10 flex items-center justify-center">
                    <CurrentIcon className="w-10 h-10 text-cedar" />
                  </div>
                </div>

                {/* Step Number */}
                <div className="text-center mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                    {currentIndex + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-gray-900 text-center mb-3">
                  {getLocalizedText(currentCard.label, locale)}
                </h3>

                {/* Description - Second person narration */}
                <p className="text-gray-600 text-center leading-relaxed">
                  {getLocalizedText(currentCard.micro, locale)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Previous Button */}
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${currentIndex === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                }
              `}
              aria-label={t("previous")}
            >
              {isRTL ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">{t("previous")}</span>
            </button>

            {/* Dot Indicators */}
            <div className="flex gap-2">
              {content.cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`
                    w-2.5 h-2.5 rounded-full transition-all duration-300
                    ${index === currentIndex
                      ? "bg-cedar w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                    }
                  `}
                  aria-label={`Go to step ${index + 1}`}
                  aria-current={index === currentIndex ? "step" : undefined}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              disabled={currentIndex === totalCards - 1}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${currentIndex === totalCards - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
                }
              `}
              aria-label={t("next")}
            >
              <span className="hidden sm:inline">{t("next")}</span>
              {isRTL ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Screen reader announcements */}
          <div className="sr-only" role="status" aria-live="polite">
            {t("stepOf", { current: currentIndex + 1, total: totalCards })}:{" "}
            {getLocalizedText(currentCard.label, locale)}
          </div>
        </div>

        {/* Alt text toggle */}
        <div className="mt-8 flex justify-center">
          <AltTextToggle altText={t("altTextVoting")} />
        </div>
      </div>
    </section>
  );
}
