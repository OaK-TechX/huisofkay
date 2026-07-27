import { StaticCatalogRepository } from "@/repositories/static-catalog.repository";
import { NeonCatalogRepository } from "@/repositories/neon-catalog.repository";
import { CatalogService } from "@/services/catalog.service";
import { CatalogPresenter } from "@/presenters/catalog.presenter";
import { siteConfig } from "@/config/site";
import { hasDatabase } from "@/lib/db";

// Composition root (poor-man's DI). The ONE place implementations are wired.
// Uses the DB-backed repo when a database is configured, else the static seed
// (so builds and local runs work with no database). Swapping data sources is a
// one-line change here and nowhere else.
const catalogRepository = hasDatabase()
  ? new NeonCatalogRepository()
  : new StaticCatalogRepository();

const catalogService = new CatalogService(catalogRepository, {
  featuredEpisodeSlug: siteConfig.featuredEpisodeSlug,
});

const catalogPresenter = new CatalogPresenter(catalogService);

export const container = {
  catalogService,
  catalogPresenter,
} as const;
