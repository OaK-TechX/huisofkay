import type {
  AnalyticsEventInput,
  AnalyticsRepository,
  AnalyticsSummary,
  CountBucket,
  DailyCount,
} from "@/repositories/analytics.repository";

export interface AnalyticsDashboard {
  summary: AnalyticsSummary;
  daily: DailyCount[];
  topEpisodes: CountBucket[];
  sources: CountBucket[];
  byType: CountBucket[];
}

export class AnalyticsService {
  constructor(private readonly repo: AnalyticsRepository) {}

  async track(event: AnalyticsEventInput): Promise<void> {
    await this.repo.record(event);
  }

  async getDashboard(): Promise<AnalyticsDashboard> {
    const [summary, daily, topEpisodes, sources, byType] = await Promise.all([
      this.repo.getSummary(),
      this.repo.getDailyCounts(30),
      this.repo.getTopEpisodes(8),
      this.repo.getSources(8),
      this.repo.getByType(),
    ]);
    return { summary, daily, topEpisodes, sources, byType };
  }
}
