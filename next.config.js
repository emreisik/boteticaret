/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '77.245.158.179'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Prevent memory issues
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },
  // Increase timeout for long-running requests
  serverRuntimeConfig: {
    maxDuration: 30,
  },
  // Optimize for production
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig

