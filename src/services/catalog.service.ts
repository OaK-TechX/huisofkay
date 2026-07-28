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
