import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Mengaktifkan Dependency Tracing otomatis untuk kontainer Docker (Topik 43)
  output: "standalone",

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
  // Enterprise Hardening: Sembunyikan header X-Powered-By di response produksi
  poweredByHeader: false,
};

export default nextConfig;
