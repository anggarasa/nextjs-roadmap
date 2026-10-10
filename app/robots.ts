import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://taskmanager.farhancoders.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/projects", "/pricing"],
        disallow: [
          "/dashboard/", // Mengamankan dashboard privat
          "/api/",        // Mengamankan internal API routes
          "/login",       // Mencegah pemborosan crawl budget pada form auth
          "/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
