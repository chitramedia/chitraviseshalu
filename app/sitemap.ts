import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chitraviseshalu.vercel.app";

  // Static routes
  const staticRoutes = [
    "",
    "/reviews",
    "/news",
    "/search",
    "/profile",
    "/watchlist",
    "/recommendations",
    "/admin",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic news articles could be fetched here if connected to database
  // Since news articles are static mock list under lib/newsData, we can list their IDs
  const newsSlugs = [
    "pushpa-2-trailer-release",
    "ss-rajamouli-mahesh-babu-globetrotter",
    "ott-releases-this-week-may",
    "avatar-3-fire-and-ash-updates",
  ];

  const newsRoutes = newsSlugs.map((slug) => ({
    url: `${baseUrl}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...newsRoutes];
}
