import type { MetadataRoute } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/artikel", "/artikel/"],
      disallow: ["/home", "/profile", "/profil", "/settings", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
