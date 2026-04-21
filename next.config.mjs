/** @type {import('next').NextConfig} */

// For GitHub Pages we publish to https://<user>.github.io/<repo>.
// The runner exports NEXT_PUBLIC_BASE_PATH=/<repo> so all asset/link prefixes match.
// Locally (no env var set) we fall back to root so `next dev` just works.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
