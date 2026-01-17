import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Remove output: 'standalone' - not needed for Vercel
  
  // Enable Turbopack explicitly and add empty config to silence warning
  turbopack: {},
  
  // Ensure proper transpilation of Leaflet packages
  transpilePackages: ['leaflet', 'react-leaflet'],
};

export default nextConfig;