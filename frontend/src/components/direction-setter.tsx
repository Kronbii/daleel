"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export function DirectionSetter() {
  const locale = useLocale();

  useEffect(() => {
    const direction = locale === "ar" ? "rtl" : "ltr";
    const lang = locale;

    // Set direction and lang on html element
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", lang);
  }, [locale]);

  return null;
}

