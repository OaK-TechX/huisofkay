import type {
  CatalogWriteRepository,
  EpisodeInput,
  SeriesInput,
} from "@/repositories/catalog-write.repository";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Admin write use-cases + validation. Depends on the write-repository abstraction.
export class AdminCatalogService {
  constructor(private readonly repo: CatalogWriteRepository) {}

  async saveSeries(input: SeriesInput): Promise<void> {
    this.assertSlug(input.slug, "series slug");
    if (!input.title.trim()) throw new Error("Title is required.");
    await this.repo.upsertSeries(input);
  }

  async deleteSeries(slug: string): Promise<void> {
    await this.repo.deleteSeries(slug);
  }

  async saveEpisode(input: EpisodeInput): Promise<void> {
    this.assertSlug(input.slug, "episode slug");
    this.assertSlug(input.seriesSlug, "series");
    if (!input.title.trim()) throw new Error("Title is required.");
    if (!input.youtubeId.trim()) throw new Error("YouTube ID is required.");
    await this.repo.upsertEpisode(input);
  }

  async deleteEpisode(slug: string): Promise<void> {
    await this.repo.deleteEpisode(slug);
  }

  async setFeaturedEpisode(slug: string): Promise<void> {
    this.assertSlug(slug, "episode slug");
    await this.repo.setSetting("featured_episode_slug", slug);
  }

  private assertSlug(slug: string, label: string): void {
    if (!SLUG_RE.test(slug)) {
      throw new Error(
        `Invalid ${label}: "${slug}" (use lowercase letters, numbers, and single hyphens).`,
      );
    }
  }
}
