import type { CatalogService } from "@/services/catalog.service";
import type { Episode, EpisodeInSeries, Series } from "@/domain/models";
import { routes } from "@/lib/routes";
import { formatRuntime } from "@/lib/format";
import { categoryForSlug, orderedCategories } from "@/lib/categories";
import type {
  HeroVM,
  HomeVM,
  MediaCardVM,
  MediaRowVM,
  UpcomingCardVM,
  WatchVM,
} from "@/viewmodels/catalog.vm";
import { episodeVideoLd } from "@/lib/structured-data";

// Presenter: maps domain -> view models. Every bit of view-shaping logic lives
// here so views never compute anything. Depends on the service abstraction only.
export class CatalogPresenter {
  constructor(private readonly service: CatalogService) {}

  async buildHome(): Promise<HomeVM> {
    const [featured, streaming, seriesList, upcoming] = await Promise.all([
      this.service.getFeaturedEpisode(),
      this.service.getStreamingEpisodes(),
      this.service.getSeries(),
      this.service.getUpcomingWorlds(),
    ]);

    const rows: MediaRowVM[] = [
      {
        key: "now-streaming",
        title: "Now Streaming",
        cards: streaming.map((item) => this.toEpisodeCard(item)),
      },
      ...this.toCategoryRows(seriesList),
    ];

    const upcomingCards: UpcomingCardVM[] = upcoming.map((world) => ({
      key: world.slug,
      title: world.title,
      note: world.note,
      badge: "SOON",
    }));

    return {
      hero: featured ? this.toHero(featured) : null,
      rows,
      upcoming: { title: "Coming Soon", cards: upcomingCards },
    };
  }

  async buildWatch(episodeSlug: string): Promise<WatchVM | null> {
    const found = await this.service.findEpisodeBySlug(episodeSlug);
    if (!found) return null;
    const { series, episode } = found;
    const next = await this.service.getNextStreamingEpisode(episode.slug);
    const nextIsReplay = next ? next.episode.slug === episode.slug : false;
    return {
      seriesTitle: series.title,
      episodeLabel: `Episode ${episode.number}`,
      title: episode.title,
      synopsis: episode.synopsis,
      meta: `${formatRuntime(episode.runtimeSeconds)} - ${series.tagline}`,
      embedUrl: routes.youtubeEmbed(episode.youtubeId),
      vertical: episode.vertical,
      subscribeHref: routes.youtubeChannel(),
      dropsHref: routes.subscribeAnchor(),
      documentTitle: `${series.title} - Episode ${episode.number}: ${episode.title}`,
      ogImageUrl: episode.thumbnailUrl,
      canonicalPath: routes.watch(episode.slug),
      jsonLd: episodeVideoLd(series, episode),
      nextHref: next ? routes.watch(next.episode.slug) : null,
      nextSeriesTitle: next ? next.series.title : null,
      nextEpisodeLabel: next
        ? `Episode ${next.episode.number}: ${next.episode.title}`
        : null,
      nextIsReplay,
    };
  }

  // Groups the slate into Netflix/Prime-style category rows in a stable order.
  private toCategoryRows(seriesList: readonly Series[]): MediaRowVM[] {
    const byCategory = new Map<string, Series[]>();
    for (const series of seriesList) {
      const category = categoryForSlug(series.slug);
      const bucket = byCategory.get(category) ?? [];
      bucket.push(series);
      byCategory.set(category, bucket);
    }
    return orderedCategories([...byCategory.keys()]).map((category) => ({
      key: `cat-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: category,
      cards: (byCategory.get(category) ?? []).map((series) =>
        this.toSeriesCard(series),
      ),
    }));
  }

  private toHero({ series, episode }: EpisodeInSeries): HeroVM {
    return {
      kicker: "FLAGSHIP SERIES",
      title: series.title,
      logline: series.logline,
      backgroundUrl: series.heroUrl,
      playHref: routes.watch(episode.slug),
      playLabel: `Play Episode ${episode.number}`,
      infoHref: routes.seriesAnchor(),
    };
  }

  private toEpisodeCard({ series, episode }: EpisodeInSeries): MediaCardVM {
    return {
      key: episode.slug,
      href: routes.watch(episode.slug),
      imageUrl: episode.thumbnailUrl,
      title: series.title,
      subtitle: `Ep ${episode.number}: ${episode.title}`,
      badge: "NEW",
    };
  }

  private toSeriesCard(series: Series): MediaCardVM {
    const firstEpisode: Episode | undefined = series.episodes[0];
    return {
      key: series.slug,
      href: firstEpisode ? routes.watch(firstEpisode.slug) : routes.subscribeAnchor(),
      imageUrl: series.posterUrl,
      title: series.title,
      subtitle: series.tagline,
      badge: series.status === "coming-soon" ? "SOON" : undefined,
    };
  }
}
