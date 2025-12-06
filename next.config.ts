/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Add this for now to ensure deployment
  },
};

module.exports = nextConfig;