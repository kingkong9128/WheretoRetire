import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Critical for Vercel deployment
  output: 'standalone',
  
  // Enable Turbopack explicitly and add empty config to silence warning
  turbopack: {},
  
  // Ensure proper transpilation of Leaflet packages
  transpilePackages: ['leaflet', 'react-leaflet'],
};

export default nextConfig;