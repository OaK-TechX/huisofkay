import type { CatalogRepository } from "@/repositories/catalog.repository";
import type { Series, UpcomingWorld } from "@/domain/models";

// Concrete repository backed by in-code data. The ONLY place raw catalog data
// lives. Swap this class for a CmsCatalogRepository / DbCatalogRepository later
// without touching services, presenters, or views (Open/Closed).
const SERIES: readonly Series[] = [
  {
    slug: "inkborne",
    title: "INKBORNE",
    tagline: "Ink is law.",
    logline:
      "In a world where a single stroke can create a world or erase one, Sumi is born with a living ink-mark, and today it answers back.",
    posterUrl: "/media/inkborne/poster.png",
    heroUrl: "/media/inkborne/hero.png",
    accentColor: "#C8102E",
    status: "streaming",
    episodes: [
      {
        id: "ep01",
        slug: "inkborne-first-stroke",
        number: 1,
        title: "First Stroke",
        synopsis:
          "Sumi's living ink-mark awakens. One strike, one clash of ink against erasure, one thread of fate pulled taut.",
        runtimeSeconds: 43,
        publishedAt: "2026-07-27",
        youtubeId: "1btIw-_eisg",
        thumbnailUrl: "/media/inkborne/ep01.png",
        vertical: true,
      },
    ],
  },
  {
    slug: "the-quantum-omen",
    title: "The Quantum Omen",
    tagline: "Ancient symbols meet modern technology.",
    logline:
      "An Afrofuturist saga blending Igbo myth and ancestral tech. Follow Nnennaya as she awakens memory through sound, story, and spirit.",
    posterUrl: "/media/quantum-omen/poster.png",
    heroUrl: "/media/quantum-omen/poster.png",
    accentColor: "#00d97e",
    status: "coming-soon",
    episodes: [],
  },
];

const UPCOMING: readonly UpcomingWorld[] = [
  { slug: "the-veiled-divinity", title: "The Veiled Divinity", note: "An epic holy war between light and shadow." },
  { slug: "the-veiled-flame-saga", title: "The Veiled Flame Saga", note: "A multiverse adventure with superpowered beings." },
  { slug: "alabaster-egg", title: "Alabaster Egg", note: "Death and resurrection in a system-powered world." },
  { slug: "creature-of-aelyria", title: "Creature of Aelyria", note: "Mystic creatures and hidden influences." },
];

export class StaticCatalogRepository implements CatalogRepository {
  async getAllSeries(): Promise<readonly Series[]> {
    return SERIES;
  }

  async getUpcomingWorlds(): Promise<readonly UpcomingWorld[]> {
    return UPCOMING;
  }
}
