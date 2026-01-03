import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

// Configure fonts with fallbacks for offline/network issues
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansArabic.variable}`}>{children}</body>
    </html>
  );
}

