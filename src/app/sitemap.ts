import type { MetadataRoute } from "next";
import { container } from "@/lib/container";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const episodes = await container.catalogService.getStreamingEpisodes();

  const home: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const watch: MetadataRoute.Sitemap = episodes.map(({ episode }) => ({
    url: `${siteConfig.url}${routes.watch(episode.slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...home, ...watch];
}
