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
}

module.exports = nextConfig

