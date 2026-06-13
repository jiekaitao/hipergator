import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoBasePath = "/hipergator";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  output: "export",
  images: { unoptimized: true },
  // Served from https://<user>.github.io/hipergator/ on GitHub Pages.
  basePath: isProd ? repoBasePath : undefined,
  assetPrefix: isProd ? repoBasePath : undefined,
  trailingSlash: true,
};

export default config;
