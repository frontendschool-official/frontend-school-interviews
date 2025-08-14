/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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