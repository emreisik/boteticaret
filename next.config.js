/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '77.245.158.179'],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Ensure static files are served correctly
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  serverRuntimeConfig: {
    maxDuration: 60,
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig
