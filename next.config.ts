
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // This is required to allow the Next.js development server to accept requests from the
  // Firebase Studio preview environment.
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        'https://*.cloudworkstations.dev',
      ],
    },
  }),
};

export default nextConfig;
