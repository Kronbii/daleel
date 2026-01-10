"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface FlippableCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isAllowed: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Reusable flippable card component with 3D CSS transform
 * Supports keyboard navigation (Enter/Space to flip)
 */
export function FlippableCard({
  frontContent,
  backContent,
  isAllowed,
  className = "",
  ariaLabel = "Flip card",
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip]
  );

  return (
    <div
      className={`perspective-1000 ${className}`}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 0.6, type: "spring", stiffness: 100 }
        }
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        aria-pressed={isFlipped}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center justify-center">
            {frontContent}
            <span className="mt-3 text-xs text-gray-400">
              ↻
            </span>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`
              h-full rounded-2xl shadow-md p-6 flex flex-col items-center justify-center
              ${isAllowed 
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200" 
                : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200"
              }
            `}
          >
            {backContent}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
