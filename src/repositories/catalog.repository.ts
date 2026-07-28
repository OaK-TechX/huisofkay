import type { Series, UpcomingWorld } from "@/domain/models";

// Repository abstraction (Dependency Inversion). Services depend on THIS, never
// on a concrete data source. Async by contract so a future CMS/DB/API drop-in
// requires no change to services or views. (Interface Segregation: only catalog
// reads live here.)
export interface CatalogRepository {
  getAllSeries(): Promise<readonly Series[]>;
  getUpcomingWorlds(): Promise<readonly UpcomingWorld[]>;
  /** Admin-configured featured episode slug, or null to fall back to config. */
  getFeaturedEpisodeSlug(): Promise<string | null>;
}
