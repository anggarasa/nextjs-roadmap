import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Mendaftarkan host yang diizinkan untuk dioptimasi
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000", // Object Storage MinIO lokal
        pathname: "/task-attachments/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Avatar GitHub
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Cover Project Banner demo
      },
    ],
    // 2. Prioritas format kompresi modern
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
