import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

interface ProjectEntity {
  id: string | number;
  name: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL || "https://taskmanager.farhancoders.com";

  // 1. Ambil daftar proyek publik live dari backend Nest.js
  let projects: ProjectEntity[] = [];
  try {
    const res = await fetch(`${env.NEST_API_URL}/projects`, {
      cache: "no-store", // Selalu sajikan data sitemap paling mutakhir
      headers: {
        "x-api-key": env.JWT_ACCESS_SECRET,
      },
    });

    if (res.ok) {
      projects = await res.json();
    }
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    console.error("[SEO] Gagal mengambil data proyek untuk sitemap:", error);
  }

  // Fallback data proyek publik jika backend belum mengembalikan data atau saat demo offline
  // Memastikan https://taskmanager.farhancoders.com/projects/proj-enterprise-01 tampil sesuai narasi naskah video
  if (!projects || projects.length === 0) {
    projects = [
      {
        id: "proj-enterprise-01",
        name: "Enterprise Core System Platform",
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // 2. Pemetaan rute dinamis proyek publik
  const dynamicProjectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Rute statis utama aplikasi
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Gabungkan seluruh entri sitemap
  return [...staticUrls, ...dynamicProjectUrls];
}
