/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable SSR for debugging
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

