/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  compiler: {
    // Strip console.* in production builds except console.error
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  experimental: {
    // Reduce bundle size by optimizing package imports
    optimizePackageImports: [
      'react-icons',
      'react-hot-toast'
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: [
          'camera=()',
          'microphone=()',
          'geolocation=()',
          'payment=(self)'
        ].join(', '),
      },
      {
        key: 'Content-Security-Policy',
        // Note: tuned to support Firebase, Google Fonts, Monaco, and Razorpay checkout
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https://*.razorpay.com",
          "font-src 'self' https://fonts.gstatic.com",
          "connect-src 'self' https://firestore.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://api.razorpay.com",
          "frame-src 'self' https://*.razorpay.com",
          "worker-src 'self' blob:",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    ];

    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Aggressive caching for static assets
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Only keep necessary fallbacks for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false, // Used in server-side payment verification
      };
    }
    return config;
  },
};

module.exports = nextConfig;