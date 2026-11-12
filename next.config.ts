
import type { NextConfig } from "next"

const isGithubPages = process.env.GITHUB_PAGES === "true"

const repository =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ||
  process.env.NEXT_PUBLIC_REPO_NAME ||
  "raizkin-portfolio"

const isUserSite = repository.toLowerCase().endsWith(".github.io")

const basePath =
  isGithubPages && !isUserSite ? `/${repository}` : ""

const nextConfig: NextConfig = {
  devIndicators: false,

  ...(isGithubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
  }),

  images: {
    unoptimized: isGithubPages,
  },

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_DEPLOY_TARGET: isGithubPages
      ? "github-pages"
      : "vercel",
  },

  ...(!isGithubPages && {
    async rewrites() {
      return [
        {
          source: "/showcase/euro-koshyk",
          destination: "/showcase/euro-koshyk/index.html",
        },
        {
          source: "/showcase/euro-koshyk/catalog",
          destination: "/showcase/euro-koshyk/index.html",
        },
      ]
    },
  }),
}

export default nextConfig
  