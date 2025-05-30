import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Configure for monorepo setup
    externalDir: true,
  },
  transpilePackages: ['@course-marketplace/shared'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle the shared package properly
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
