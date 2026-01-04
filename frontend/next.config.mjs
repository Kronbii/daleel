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
};

export default withNextIntl(nextConfig);

