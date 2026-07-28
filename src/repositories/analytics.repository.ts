export interface AnalyticsEventInput {
  type: string;
  path: string;
  episodeSlug?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  device?: string | null;
  country?: string | null;
}

export interface CountBucket {
  key: string;
  count: number;
}

export interface DailyCount {
  day: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsSummary {
  total: number;
  last7: number;
  last30: number;
  pageViews: number;
}

export interface AnalyticsRepository {
  record(event: AnalyticsEventInput): Promise<void>;
  getSummary(): Promise<AnalyticsSummary>;
  getDailyCounts(days: number): Promise<DailyCount[]>;
  getTopEpisodes(limit: number): Promise<CountBucket[]>;
  getSources(limit: number): Promise<CountBucket[]>;
  getByType(): Promise<CountBucket[]>;
}
