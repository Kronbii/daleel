import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@daleel/core";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}

