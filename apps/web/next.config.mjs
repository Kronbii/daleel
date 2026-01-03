import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@daleel/ui", "@daleel/core", "@daleel/db"],
  // Security headers are set in middleware.ts
  // Prisma client will be available via @daleel/db package
};

export default withNextIntl(nextConfig);

