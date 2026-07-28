import type { CatalogRepository } from "@/repositories/catalog.repository";
import type { EpisodeInSeries, Series, UpcomingWorld } from "@/domain/models";

export interface CatalogServiceOptions {
  readonly featuredEpisodeSlug?: string;
}

// Application/business logic. Depends only on the repository abstraction
// (Dependency Inversion). Single responsibility: answer catalog use-cases.
// Presenters/views never talk to a repository directly.
export class CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly options: CatalogServiceOptions = {},
  ) {}

  async getSeries(): Promise<readonly Series[]> {
    return this.repository.getAllSeries();
  }

  async getUpcomingWorlds(): Promise<readonly UpcomingWorld[]> {
    return this.repository.getUpcomingWorlds();
  }

  async getStreamingEpisodes(): Promise<readonly EpisodeInSeries[]> {
    const series = await this.repository.getAllSeries();
    return series.flatMap((s) => s.episodes.map((episode) => ({ series: s, episode })));
  }

  async findEpisodeBySlug(slug: string): Promise<EpisodeInSeries | null> {
    const series = await this.repository.getAllSeries();
    for (const s of series) {
      const episode = s.episodes.find((e) => e.slug === slug);
      if (episode) return { series: s, episode };
    }
    return null;
  }

  /**
   * Business rule: the "next" episode is the following streaming episode in
   * catalog order, wrapping back to the first when the current one is last.
   * Returns null only when there are no streaming episodes at all.
   */
  async getNextStreamingEpisode(currentSlug: string): Promise<EpisodeInSeries | null> {
    const streaming = await this.getStreamingEpisodes();
    if (streaming.length === 0) return null;
    const index = streaming.findIndex((item) => item.episode.slug === currentSlug);
    if (index === -1) return streaming[0] ?? null;
    return streaming[(index + 1) % streaming.length] ?? null;
  }

  /** Business rule: featured = admin setting (DB), else configured slug, else the first streaming episode. */
  async getFeaturedEpisode(): Promise<EpisodeInSeries | null> {
    const dbSlug = await this.repository.getFeaturedEpisodeSlug();
    const slug = dbSlug ?? this.options.featuredEpisodeSlug;
    if (slug) {
      const found = await this.findEpisodeBySlug(slug);
      if (found) return found;
    }
    const streaming = await this.getStreamingEpisodes();
    return streaming[0] ?? null;
  }
}
