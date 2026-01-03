import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@daleel/ui", "@daleel/core", "@daleel/db"],
  // Security headers are set in middleware.ts
  // Ensure Prisma client is available at runtime
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle @prisma/client - it needs to be resolved from node_modules
      // This ensures the generated Prisma client (with binaries) is used
      config.externals = config.externals || [];
      if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = [
          ...(Array.isArray(originalExternals) ? originalExternals : []),
          "@prisma/client",
          ".prisma/client",
        ];
      } else if (Array.isArray(config.externals)) {
        config.externals.push("@prisma/client", ".prisma/client");
      }
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

