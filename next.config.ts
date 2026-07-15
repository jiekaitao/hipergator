import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repoBasePath = "/hipergator";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  output: "export",
  images: { unoptimized: true },
  // GitHub Pages needs the repository prefix. Vercel and local builds are
  // served from the domain root, so applying this to every production build
  // makes their CSS, fonts, and scripts resolve to 404s.
  basePath: isGitHubPages ? repoBasePath : undefined,
  assetPrefix: isGitHubPages ? repoBasePath : undefined,
  trailingSlash: true,
};

export default config;
