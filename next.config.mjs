/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true,
    domains: ['static.usernames.app-backend.toolsforhumanity.com']
  },
  experimental: {
    allowedDevOrigins: ['*'] // Change to your domain in production
  },
  reactStrictMode: false
};

export default nextConfig;
