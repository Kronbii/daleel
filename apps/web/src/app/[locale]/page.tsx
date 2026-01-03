/**
 * Home page
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@daleel/ui";
import { Button } from "@daleel/ui";
import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("common");

  const features = [
    {
      title: t("candidates"),
      description: t("candidatesDesc"),
      href: `/${locale}/candidates`,
      icon: "👤",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: t("districts"),
      description: t("districtsDesc"),
      href: `/${locale}/districts`,
      icon: "🗺️",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: t("lists"),
      description: t("listsDesc"),
      href: `/${locale}/lists`,
      icon: "📋",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
        <div className="container relative mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              Daleel - دليل
            </h1>
            <p className="mt-6 text-xl leading-8 text-blue-100 sm:text-2xl">
              {locale === "ar"
                ? "مبادرة مدنية مستقلة تقدم معلومات عامة عن الانتخابات النيابية اللبنانية"
                : locale === "fr"
                  ? "Initiative civique indépendante fournissant des informations publiques sur les élections parlementaires libanaises"
                  : "Independent civic initiative providing public information about Lebanese parliamentary elections"}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {locale === "ar" ? "استكشف معلومات الانتخابات" : locale === "fr" ? "Explorer les informations électorales" : "Explore Election Information"}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {locale === "ar"
                ? "الوصول إلى معلومات شاملة حول المرشحين والدوائر والقوائم الانتخابية"
                : locale === "fr"
                  ? "Accédez à des informations complètes sur les candidats, les circonscriptions et les listes électorales"
                  : "Access comprehensive information about candidates, districts, and electoral lists"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="group relative h-full overflow-hidden border-2 border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                  <CardHeader className="relative">
                    <div className="mb-4 text-4xl">{feature.icon}</div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {locale === "ar" ? `${t("explore")} ←` : `${t("explore")} →`}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("tagline")}
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("description")}
            </p>
            <div className="mt-10">
              <Link href={`/${locale}/legal`}>
                <Button variant="outline" size="lg">
                  {t("learnMore")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
