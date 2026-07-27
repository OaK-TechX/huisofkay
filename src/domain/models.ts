// Domain layer: framework-agnostic entities. No React, no Next, no data-source
// concerns. These are the single source of truth for what the business deals in.

export type SeriesStatus = "streaming" | "coming-soon";

export interface Episode {
  readonly id: string;
  readonly slug: string;
  readonly number: number;
  readonly title: string;
  readonly synopsis: string;
  readonly runtimeSeconds: number;
  readonly publishedAt: string; // ISO 8601 date
  readonly youtubeId: string;
  readonly thumbnailUrl: string;
  readonly vertical: boolean;
}

export interface Series {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly logline: string;
  readonly posterUrl: string;
  readonly heroUrl: string;
  readonly accentColor: string;
  readonly status: SeriesStatus;
  readonly episodes: readonly Episode[];
}

export interface UpcomingWorld {
  readonly slug: string;
  readonly title: string;
  readonly note: string;
}

/** A resolved episode together with the series it belongs to. */
export interface EpisodeInSeries {
  readonly series: Series;
  readonly episode: Episode;
}
