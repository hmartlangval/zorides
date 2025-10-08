/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // COMPLETELY DISABLE ALL CACHING - This is a real-time social app!
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Disable static optimization
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig