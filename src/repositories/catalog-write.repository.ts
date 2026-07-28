import type { SeriesStatus } from "@/domain/models";

export interface SeriesInput {
  slug: string;
  title: string;
  tagline: string;
  logline: string;
  posterUrl: string;
  heroUrl: string;
  accentColor: string;
  status: SeriesStatus;
  sortOrder: number;
}

export interface EpisodeInput {
  slug: string;
  seriesSlug: string;
  number: number;
  title: string;
  synopsis: string;
  runtimeSeconds: number;
  publishedAt: string;
  youtubeId: string;
  thumbnailUrl: string;
  vertical: boolean;
  sortOrder: number;
}

// Write side of the catalog (admin). Separate interface from the read repository
// (Interface Segregation): the public site only ever needs reads.
export interface CatalogWriteRepository {
  upsertSeries(input: SeriesInput): Promise<void>;
  deleteSeries(slug: string): Promise<void>;
  upsertEpisode(input: EpisodeInput): Promise<void>;
  deleteEpisode(slug: string): Promise<void>;
  setSetting(key: string, value: string): Promise<void>;
}
