import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, type Locale } from "@daleel/shared";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DirectionSetter } from "@/components/direction-setter";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <DirectionSetter />
      <div className="min-h-screen flex flex-col relative">
        {/* Global background decorative elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Main gradient */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #f8faf9 0%, #ffffff 50%, #f0fdf4 100%)",
            }}
          />
          
          {/* Large soft circle - top right */}
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
            }}
          />
          
          {/* Medium circle - bottom left */}
          <div 
            className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
            }}
          />

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

