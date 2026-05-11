import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ----------------------------------------------------------------- */
  /*  Image optimisation                                               */
  /*  - Modern formats first (AVIF then WebP) shaves ~30% off transfer */
  /*    over JPEG with no perceptible quality loss.                    */
  /*  - deviceSizes/imageSizes match the breakpoints actually used in  */
  /*    components (sm/md/lg ⇒ 640/768/1024 + retina).                 */
  /*  - minimumCacheTTL keeps optimised variants cached on Vercel for  */
  /*    1 year (matches Vercel image cache headers).                   */
  /* ----------------------------------------------------------------- */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn1.urlaub.check24.de',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  /* ----------------------------------------------------------------- */
  /*  Compression / production polish                                  */
  /* ----------------------------------------------------------------- */
  compress: true,
  poweredByHeader: false,

  /* ----------------------------------------------------------------- */
  /*  Long-cache headers for static assets in /public/                 */
  /*  (next/image already gets long cache via minimumCacheTTL above).  */
  /*  Security headers harden the response for both Lighthouse and     */
  /*  general defence-in-depth.                                        */
  /* ----------------------------------------------------------------- */
  async headers() {
    return [
      {
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff|woff2|ttf)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
        ],
      },
    ]
  },

  /* ----------------------------------------------------------------- */
  /*  Legacy /maldives.png + a few other assumed-removed paths.        */
  /*  Add SEO redirects here if Search Console flags 404s later.       */
  /* ----------------------------------------------------------------- */
  async redirects() {
    return [
      // Trailing-slash variants of category pages — keep canonical without slash.
      { source: '/all-inclusive/', destination: '/all-inclusive', permanent: true },
      { source: '/lastminute/', destination: '/lastminute', permanent: true },
      { source: '/fruehbucher/', destination: '/fruehbucher', permanent: true },
      { source: '/mietwagen/', destination: '/mietwagen', permanent: true },
      { source: '/pauschalreisen/', destination: '/pauschalreisen', permanent: true },
      { source: '/ratgeber/', destination: '/ratgeber', permanent: true },
      { source: '/alle-angebote/', destination: '/alle-angebote', permanent: true },
    ]
  },
};

export default nextConfig;
