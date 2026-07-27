import { siteConfig } from "@/config/site";
import type { Episode, Series } from "@/domain/models";
import { routes } from "@/lib/routes";

// schema.org JSON-LD builders. Pure functions -> plain objects. Kept out of
// components; a <JsonLd> view renders whatever these return.

function absolute(path: string): string {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

export function organizationLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absolute(siteConfig.brand.logoUrl),
    description: siteConfig.description,
    sameAs: siteConfig.socials.map((s) => s.href),
  };
}

export function websiteLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
  };
}

export function episodeVideoLd(series: Series, episode: Episode): object {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${series.title} - Episode ${episode.number}: ${episode.title}`,
    description: episode.synopsis,
    thumbnailUrl: [absolute(episode.thumbnailUrl)],
    uploadDate: episode.publishedAt,
    embedUrl: `https://www.youtube.com/embed/${episode.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${episode.youtubeId}`,
    url: absolute(routes.watch(episode.slug)),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absolute(siteConfig.brand.logoUrl) },
    },
    partOfSeries: {
      "@type": "CreativeWorkSeries",
      name: series.title,
    },
  };
}
