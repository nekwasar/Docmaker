import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['77.67.23.30', 'localhost:4000', 'docmaker.io', 'www.docmaker.io'],
  async redirects() {
    return [
      { source: '/merge-pdf', destination: '/pdf/merge', permanent: true },
      { source: '/split-pdf', destination: '/pdf/split', permanent: true },
      { source: '/compress-pdf', destination: '/pdf/compress', permanent: true },
      { source: '/encrypt', destination: '/pdf/protect', permanent: true },
      { source: '/watermark', destination: '/pdf/watermark', permanent: true },
      { source: '/edit-pdf', destination: '/pdf', permanent: true },
    ];
  },
};

export default nextConfig;
