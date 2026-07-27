import { StaticCatalogRepository } from "@/repositories/static-catalog.repository";
import { CatalogService } from "@/services/catalog.service";
import { CatalogPresenter } from "@/presenters/catalog.presenter";
import { siteConfig } from "@/config/site";

// Composition root (poor-man's DI). The ONE place concrete implementations are
// wired to abstractions. Routes ask the container for a presenter; swapping the
// repository (CMS/DB) or a service is a one-line change here and nowhere else.
const catalogRepository = new StaticCatalogRepository();

const catalogService = new CatalogService(catalogRepository, {
  featuredEpisodeSlug: siteConfig.featuredEpisodeSlug,
});

const catalogPresenter = new CatalogPresenter(catalogService);

export const container = {
  catalogService,
  catalogPresenter,
} as const;
