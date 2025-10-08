/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Disable caching for development (interactive app)
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
}

module.exports = nextConfig
