"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { ReactNode } from "react";

interface AnimationWrapperProps {
  children: ReactNode;
  className?: string;
  /** Animation variants for when reduced motion is NOT preferred */
  variants?: Variants;
  /** Whether to animate only when in viewport */
  whileInView?: boolean;
  /** Viewport options for intersection observer */
  viewportOptions?: {
    once?: boolean;
    amount?: number | "some" | "all";
    margin?: string;
  };
}

/**
 * Wrapper component that respects prefers-reduced-motion
 * Animations are disabled when the user has requested reduced motion
 */
export function AnimationWrapper({
  children,
  className,
  variants,
  whileInView = false,
  viewportOptions = { once: true, amount: 0.3 },
  ...motionProps
}: AnimationWrapperProps) {
  const reducedMotion = useReducedMotion();

  // If reduced motion is preferred, render without animations
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Default fade-in variants
  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
  };

  const animationVariants = variants || defaultVariants;

  if (whileInView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOptions}
        variants={animationVariants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={animationVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container for animating children in sequence
 */
export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  whileInView = false,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  whileInView?: boolean;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  if (whileInView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item for stagger animations
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
