import type { NextConfig } from "next";

// Standalone output is only enabled for the container build (Coolify/homelab).
// The Netlify plugin needs the default output, so we gate it behind an env var
// that only the Dockerfile sets - this keeps the primary Netlify build unchanged.
const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;
