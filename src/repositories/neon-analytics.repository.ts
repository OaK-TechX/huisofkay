import { desc, gte, isNotNull, sql } from "drizzle-orm";
import type {
  AnalyticsEventInput,
  AnalyticsRepository,
  AnalyticsSummary,
  CountBucket,
  DailyCount,
} from "@/repositories/analytics.repository";
import { getDb } from "@/lib/db";
import { analyticsEvents } from "../../db/schema";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000);
}

export class NeonAnalyticsRepository implements AnalyticsRepository {
  async record(event: AnalyticsEventInput): Promise<void> {
    await getDb().insert(analyticsEvents).values(event);
  }

  async getSummary(): Promise<AnalyticsSummary> {
    const db = getDb();
    const count = (where?: ReturnType<typeof gte>) =>
      (where
        ? db.select({ c: sql<number>`count(*)::int` }).from(analyticsEvents).where(where)
        : db.select({ c: sql<number>`count(*)::int` }).from(analyticsEvents)
      ).then((r) => r[0]?.c ?? 0);

    const [total, last7, last30, pageViews] = await Promise.all([
      count(),
      count(gte(analyticsEvents.createdAt, daysAgo(7))),
      count(gte(analyticsEvents.createdAt, daysAgo(30))),
      db
        .select({ c: sql<number>`count(*)::int` })
        .from(analyticsEvents)
        .where(sql`${analyticsEvents.type} = 'page_view'`)
        .then((r) => r[0]?.c ?? 0),
    ]);
    return { total, last7, last30, pageViews };
  }

  async getDailyCounts(days: number): Promise<DailyCount[]> {
    const rows = await getDb()
      .select({
        day: sql<string>`to_char(date_trunc('day', ${analyticsEvents.createdAt}), 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, daysAgo(days)))
      .groupBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`)
      .orderBy(sql`date_trunc('day', ${analyticsEvents.createdAt})`);
    return rows.map((r) => ({ day: r.day, count: r.count }));
  }

  async getTopEpisodes(limit: number): Promise<CountBucket[]> {
    const rows = await getDb()
      .select({ key: analyticsEvents.episodeSlug, count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(isNotNull(analyticsEvents.episodeSlug))
      .groupBy(analyticsEvents.episodeSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
    return rows.map((r) => ({ key: r.key ?? "unknown", count: r.count }));
  }

  async getSources(limit: number): Promise<CountBucket[]> {
    const rows = await getDb()
      .select({
        key: sql<string>`coalesce(${analyticsEvents.utmSource}, 'direct')`,
        count: sql<number>`count(*)::int`,
      })
      .from(analyticsEvents)
      .groupBy(sql`coalesce(${analyticsEvents.utmSource}, 'direct')`)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
    return rows.map((r) => ({ key: r.key, count: r.count }));
  }

  async getByType(): Promise<CountBucket[]> {
    const rows = await getDb()
      .select({ key: analyticsEvents.type, count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .groupBy(analyticsEvents.type)
      .orderBy(desc(sql`count(*)`));
    return rows.map((r) => ({ key: r.key, count: r.count }));
  }
}
