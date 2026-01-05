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

        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

