"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@daleel/ui";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
  className,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => 
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 text-left rounded-xl border transition-all duration-200",
          "flex items-center justify-between gap-2",
          "bg-white/80 backdrop-blur-sm",
          disabled
            ? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
            : "border-gray-200 hover:border-emerald-300 hover:bg-white",
          isOpen && "border-emerald-500 ring-2 ring-emerald-500/20 bg-white",
          "focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        )}
      >
        <span
          className={cn(
            "block truncate text-sm",
            selectedOption ? "text-gray-900" : "text-gray-500"
          )}
        >
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden"
          style={{ zIndex: 9999 }}
        >
          <ul
            ref={listRef}
            className="py-2 max-h-[200px] overflow-y-auto"
            role="listbox"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db transparent'
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100",
                  "flex items-center gap-2",
                  option.value === value
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : highlightedIndex === index
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {option.value === value && (
                  <svg
                    className="w-4 h-4 text-emerald-600 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
                <span className={cn("truncate", option.value !== value && "ml-6")}>
                  {option.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

