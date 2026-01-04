import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Transpile the shared workspace package
  transpilePackages: ["@daleel/shared"],
  // Set Turbopack root to workspace root (monorepo setup)
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  // Webpack config to handle backend imports (for non-Turbopack builds)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add parent directory to module resolution for backend imports
      config.resolve.modules = [
        ...(config.resolve.modules || []),
        path.resolve(__dirname, ".."),
      ];
    }
    return config;
  },
};

export default withNextIntl(nextConfig);

