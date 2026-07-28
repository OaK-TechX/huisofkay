import { eq } from "drizzle-orm";
import type {
  CatalogWriteRepository,
  EpisodeInput,
  SeriesInput,
} from "@/repositories/catalog-write.repository";
import { getDb } from "@/lib/db";
import {
  episodes as episodesTable,
  series as seriesTable,
  settings as settingsTable,
} from "../../db/schema";

export class NeonCatalogWriteRepository implements CatalogWriteRepository {
  async upsertSeries(input: SeriesInput): Promise<void> {
    const db = getDb();
    await db
      .insert(seriesTable)
      .values(input)
      .onConflictDoUpdate({
        target: seriesTable.slug,
        set: {
          title: input.title,
          tagline: input.tagline,
          logline: input.logline,
          posterUrl: input.posterUrl,
          heroUrl: input.heroUrl,
          accentColor: input.accentColor,
          status: input.status,
          sortOrder: input.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  async deleteSeries(slug: string): Promise<void> {
    const db = getDb();
    await db.delete(seriesTable).where(eq(seriesTable.slug, slug));
  }

  async upsertEpisode(input: EpisodeInput): Promise<void> {
    const db = getDb();
    await db
      .insert(episodesTable)
      .values(input)
      .onConflictDoUpdate({
        target: episodesTable.slug,
        set: {
          seriesSlug: input.seriesSlug,
          number: input.number,
          title: input.title,
          synopsis: input.synopsis,
          runtimeSeconds: input.runtimeSeconds,
          publishedAt: input.publishedAt,
          youtubeId: input.youtubeId,
          thumbnailUrl: input.thumbnailUrl,
          vertical: input.vertical,
          sortOrder: input.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  async deleteEpisode(slug: string): Promise<void> {
    const db = getDb();
    await db.delete(episodesTable).where(eq(episodesTable.slug, slug));
  }

  async setSetting(key: string, value: string): Promise<void> {
    const db = getDb();
    await db
      .insert(settingsTable)
      .values({ key, value })
      .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
  }
}
