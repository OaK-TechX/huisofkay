// Seed the catalog into the database. Run with DATABASE_URL set:
//   pnpm exec tsx scripts/seed.ts
import { getDb } from "../src/lib/db";
import { series, episodes, upcomingWorlds, settings } from "../db/schema";

async function main() {
  const db = getDb();

  await db
    .insert(series)
    .values([
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
        sortOrder: 0,
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
        sortOrder: 1,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(episodes)
    .values([
      {
        seriesSlug: "inkborne",
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
        sortOrder: 0,
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(upcomingWorlds)
    .values([
      { slug: "the-veiled-divinity", title: "The Veiled Divinity", note: "An epic holy war between light and shadow.", sortOrder: 0 },
      { slug: "the-veiled-flame-saga", title: "The Veiled Flame Saga", note: "A multiverse adventure with superpowered beings.", sortOrder: 1 },
      { slug: "alabaster-egg", title: "Alabaster Egg", note: "Death and resurrection in a system-powered world.", sortOrder: 2 },
      { slug: "creature-of-aelyria", title: "Creature of Aelyria", note: "Mystic creatures and hidden influences.", sortOrder: 3 },
    ])
    .onConflictDoNothing();

  await db
    .insert(settings)
    .values([{ key: "featured_episode_slug", value: "inkborne-first-stroke" }])
    .onConflictDoNothing();

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
