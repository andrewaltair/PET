const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Disable source maps in development for faster compilation
  productionBrowserSourceMaps: false,
  // Disable caching for locale files to prevent freezing
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize module resolution
  // Removed modularizeImports for @tanstack/react-query to avoid import issues
  // Transpile shared types package
  transpilePackages: ['petservice-marketplace-shared-types'],
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Compression
  compress: true,
  // PoweredBy header
  poweredByHeader: false,
  // Production optimizations
  productionBrowserSourceMaps: false,
  swcMinify: true,
  // Windows filesystem workaround
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Simplified webpack config to prevent freezes
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Completely disable webpack cache to prevent Windows file locking issues
      config.cache = false;
      
      // Disable persistent cache entirely
      if (config.resolveLoader) {
        config.resolveLoader.cache = false;
      }
      
      // Only configure watchOptions for client builds
      if (!isServer) {
        config.watchOptions = {
          ...config.watchOptions,
          // Stay within project directory only
          ignored: [
            '**/node_modules/**',
            '**/.next/**',
            '**/.git/**',
            '**/oneDrive/**',
            '**/.svn/**',
            '**/.hg/**',
            '**/.idea/**',
            '**/.vscode/**',
            // Ignore Windows system files
            '**/hiberfil.sys',
            '**/pagefile.sys',
            '**/swapfile.sys',
            '**/DumpStack.log.tmp',
            '**/Thumbs.db',
          ],
          followSymlinks: false,
          aggregateTimeout: 500,
          // Use polling on Windows to avoid file watching issues
          poll: 2000,
        };
      }
    }
    return config;
  },
}

module.exports = withNextIntl(nextConfig)

