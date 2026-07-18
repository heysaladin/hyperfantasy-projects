/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    browsersListForSwc: true,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig;