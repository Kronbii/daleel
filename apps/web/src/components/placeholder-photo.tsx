/**
 * Placeholder photo component for candidates
 * Deterministic based on candidate id or slug
 */

import type { PlaceholderPhotoStyle } from "@prisma/client";

interface PlaceholderPhotoProps {
  style: PlaceholderPhotoStyle;
  seed: string; // candidate id or slug
  size?: number;
  className?: string;
}

export function PlaceholderPhoto({ style, seed, size = 200, className }: PlaceholderPhotoProps) {
  // Deterministic color based on seed
  const hash = seed.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const hue = Math.abs(hash % 360);
  const color = `hsl(${hue}, 60%, 50%)`;

  if (style === "GEOMETRIC") {
    return (
      <div
        className={`rounded-full bg-gray-200 flex items-center justify-center ${className || ""}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 100 100" fill="white">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    );
  }

  if (style === "INITIALS") {
    const initials = seed
      .split(/[-_\s]/)
      .map((part) => part[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("");
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-semibold ${className || ""}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          fontSize: size * 0.4,
        }}
      >
        {initials || "?"}
      </div>
    );
  }

  // SILHOUETTE
  return (
    <div
      className={`rounded-full bg-gray-300 flex items-center justify-center ${className || ""}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100" fill="gray">
        <circle cx="50" cy="35" r="15" />
        <ellipse cx="50" cy="75" rx="25" ry="20" />
      </svg>
    </div>
  );
}

