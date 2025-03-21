import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/register',
              destination: '/login',
              permanent: false,
            },
          ]
        : []),
    ];
  },
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
