"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@daleel/shared";
import { sections, getLocalizedText } from "@/lib/electoral-laws-content";
import { AnimationWrapper } from "./AnimationWrapper";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQSectionProps {
  locale: Locale;
}

export function FAQSection({ locale }: FAQSectionProps) {
  const t = useTranslations("electoralLaws");
  const content = sections.s7_faq;
  const reducedMotion = useReducedMotion();

  // Track which question is open (for fade effect on others)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <AnimationWrapper whileInView className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-gray-900 mb-4">
            {getLocalizedText(content.title, locale)}
          </h2>
        </AnimationWrapper>

        {/* FAQ Accordion */}
        <div className="max-w-2xl mx-auto space-y-3">
          {content.questions.map((faq, index) => {
            const isOpen = openIndex === index;
            const isFaded = openIndex !== null && openIndex !== index;

            return (
              <Disclosure key={faq.key}>
                {({ open }) => {
                  // Sync Disclosure state with our state
                  if (open && openIndex !== index) {
                    // Use setTimeout to avoid state update during render
                    setTimeout(() => setOpenIndex(index), 0);
                  } else if (!open && openIndex === index) {
                    setTimeout(() => setOpenIndex(null), 0);
                  }

                  return (
                    <motion.div
                      className={`
                        bg-white rounded-xl border border-gray-100 overflow-hidden
                        transition-all duration-300
                        ${open ? "shadow-md border-cedar/20" : "shadow-sm hover:shadow-md"}
                      `}
                      animate={{
                        opacity: isFaded ? 0.5 : 1,
                        scale: isFaded ? 0.98 : 1,
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.2 }}
                    >
                      <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 rounded-xl">
                        <div className="flex items-center gap-3">
                          <HelpCircle
                            className={`
                              w-5 h-5 flex-shrink-0 transition-colors duration-200
                              ${open ? "text-cedar" : "text-gray-400"}
                            `}
                          />
                          <span
                            className={`
                              font-medium transition-colors duration-200
                              ${open ? "text-cedar" : "text-gray-800"}
                            `}
                          >
                            {getLocalizedText(faq.q, locale)}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: reducedMotion ? 0 : 0.2 }}
                        >
                          <ChevronDown
                            className={`
                              w-5 h-5 flex-shrink-0 transition-colors duration-200
                              ${open ? "text-cedar" : "text-gray-400"}
                            `}
                          />
                        </motion.div>
                      </DisclosureButton>

                      <AnimatePresence>
                        {open && (
                          <DisclosurePanel static>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reducedMotion ? 0 : 0.3,
                                ease: "easeInOut",
                              }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-4 pt-0">
                                <div className="pl-8 border-l-2 border-cedar/20">
                                  <p className="text-gray-600 leading-relaxed">
                                    {getLocalizedText(faq.a_micro, locale)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </DisclosurePanel>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }}
              </Disclosure>
            );
          })}
        </div>

        {/* Visual hint for interaction */}
        <p className="text-center text-sm text-gray-400 mt-6">
          {locale === "ar"
            ? "انقر على السؤال للإجابة"
            : locale === "fr"
            ? "Cliquez sur une question pour voir la réponse"
            : "Click a question to reveal the answer"}
        </p>
      </div>
    </section>
  );
}
