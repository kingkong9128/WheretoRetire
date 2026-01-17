import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Critical for Vercel deployment
  output: 'standalone',
  
  // Required for Leaflet to work in Next.js
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  
  // Ensure proper static file handling
  transpilePackages: ['leaflet', 'react-leaflet'],
};

export default nextConfig;