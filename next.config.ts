/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Add this for now to ensure deployment
  },

  // Proxy /api/v1/* to the external backend so the browser never makes a
  // cross-origin request (eliminates CORS preflight failures in development).
  // beforeFiles ensures this runs BEFORE Next.js's own /api/* handler,
  // otherwise afterFiles rewrites get blocked by the API routes interceptor.
  async rewrites() {
    const apiDomain = process.env.NEXT_PUBLIC_EXTERNAL_API_DOMAIN;
    if (!apiDomain) return { beforeFiles: [] };
    return {
      beforeFiles: [
        {
          source: "/api/v1/:path*",
          destination: `${apiDomain}/api/v1/:path*`,
        },
      ],
    };
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;