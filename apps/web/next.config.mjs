import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@daleel/ui", "@daleel/core", "@daleel/db"],
  // Ensure Prisma client is not bundled and resolved from node_modules at runtime
  // This is required for Vercel deployments in monorepos
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  // Configure webpack to help resolve Prisma client correctly
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Help webpack resolve .prisma/client from the monorepo root
      config.resolve.alias = {
        ...config.resolve.alias,
        ".prisma/client": path.resolve(
          process.cwd(),
          "../../node_modules/.prisma/client"
        ),
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

