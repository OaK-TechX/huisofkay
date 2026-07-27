import { asc } from "drizzle-orm";
import type { CatalogRepository } from "@/repositories/catalog.repository";
import type { Episode, Series, UpcomingWorld } from "@/domain/models";
import { getDb } from "@/lib/db";
import {
  episodes as episodesTable,
  series as seriesTable,
  upcomingWorlds as upcomingTable,
  type EpisodeRow,
  type SeriesRow,
} from "../../db/schema";

// DB-backed implementation of the catalog repository (Netlify DB / Neon via
// Drizzle). Same interface as StaticCatalogRepository -> services/views unchanged.
export class NeonCatalogRepository implements CatalogRepository {
  async getAllSeries(): Promise<readonly Series[]> {
    const db = getDb();
    const [seriesRows, episodeRows] = await Promise.all([
      db.select().from(seriesTable).orderBy(asc(seriesTable.sortOrder)),
      db
        .select()
        .from(episodesTable)
        .orderBy(asc(episodesTable.sortOrder), asc(episodesTable.number)),
    ]);

    return seriesRows.map((s) => this.toSeries(s, episodeRows));
  }

  async getUpcomingWorlds(): Promise<readonly UpcomingWorld[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(upcomingTable)
      .orderBy(asc(upcomingTable.sortOrder));
    return rows.map((u) => ({ slug: u.slug, title: u.title, note: u.note }));
  }

  private toSeries(s: SeriesRow, allEpisodes: EpisodeRow[]): Series {
    return {
      slug: s.slug,
      title: s.title,
      tagline: s.tagline,
      logline: s.logline,
      posterUrl: s.posterUrl,
      heroUrl: s.heroUrl,
      accentColor: s.accentColor,
      status: s.status,
      episodes: allEpisodes
        .filter((e) => e.seriesSlug === s.slug)
        .map((e) => this.toEpisode(e)),
    };
  }

  private toEpisode(e: EpisodeRow): Episode {
    return {
      id: e.id,
      slug: e.slug,
      number: e.number,
      title: e.title,
      synopsis: e.synopsis,
      runtimeSeconds: e.runtimeSeconds,
      publishedAt: e.publishedAt,
      youtubeId: e.youtubeId,
      thumbnailUrl: e.thumbnailUrl,
      vertical: e.vertical,
    };
  }
}
