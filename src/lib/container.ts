import { StaticCatalogRepository } from "@/repositories/static-catalog.repository";
import { NeonCatalogRepository } from "@/repositories/neon-catalog.repository";
import { NeonCatalogWriteRepository } from "@/repositories/neon-catalog-write.repository";
import { CatalogService } from "@/services/catalog.service";
import { AdminCatalogService } from "@/services/admin-catalog.service";
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

// Write side always targets the DB (admin only runs where a database exists).
const adminCatalogService = new AdminCatalogService(new NeonCatalogWriteRepository());

export const container = {
  catalogService,
  catalogPresenter,
  adminCatalogService,
} as const;

