import type { Metadata } from "next";
import { DM_Serif_Display, Outfit, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

// Elegant serif for headings - distinctive and authoritative
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

// Clean geometric sans for body text
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Daleel - دليل",
  description: "Independent civic initiative providing public information about Lebanese parliamentary elections",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning className={`${dmSerif.variable} ${outfit.variable} ${notoSansArabic.variable}`}>{children}</body>
    </html>
  );
}

