import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/heysaladin',
        destination: '/about/team/heysaladin',
        permanent: true,
      },
      {
        source: '/hikari',
        destination: '/about/team/hikari',
        permanent: true,
      },
      {
        source: '/mitayani',
        destination: '/about/team/mitayani',
        permanent: true,
      },
      {
        source: '/dravenclaw',
        destination: '/about/team/dravenclaw',
        permanent: true,
      },
      {
        source: '/thinksoft',
        destination: '/about/team/thinksoft',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
