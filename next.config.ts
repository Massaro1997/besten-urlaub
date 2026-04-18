import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn1.urlaub.check24.de',
        pathname: '/**',
      },
    ],
    qualities: [75, 90],
  },
};

export default nextConfig;
