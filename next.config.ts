
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
};

export default nextConfig;
