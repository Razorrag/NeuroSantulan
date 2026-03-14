/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  
  // Tree shaking - remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Power by header
  poweredByHeader: false,
};

export default nextConfig;
