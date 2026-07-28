// Adds the future worlds as coming-soon series (with covers) and removes the
// text-only upcoming_worlds that are now covered series. Run:
//   export $(grep DATABASE_URL .env | xargs) && pnpm exec tsx scripts/seed-worlds.ts
import { inArray } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { series, upcomingWorlds } from "../db/schema";

const worlds = [
  { slug: "the-veiled-divinity", title: "The Veiled Divinity", tagline: "Urban fantasy. Gods among us.", logline: "In a city where gods secretly walk among humans, one breaks the ancient rule to befriend a mortal.", accent: "#6ea8ff", sort: 2 },
  { slug: "the-veiled-flame-saga", title: "The Veiled Flame Saga", tagline: "Multiverse saga. The Origin Flame.", logline: "Five fragments of the Origin Flame across five realms, and one collapse to stop: the Hollow God.", accent: "#ff7a3c", sort: 3 },
  { slug: "alabaster-egg", title: "The Alabaster Egg", tagline: "Progression fantasy. The Oracle egg.", logline: "Betrayed and left for dead, a cynic reawakens with the Oracle egg and the power of Anima.", accent: "#e8e2d0", sort: 4 },
  { slug: "creature-of-aelyria", title: "Creatures of Aelyria", tagline: "Mythic worldbuilding.", logline: "A world of sentient species - water-singers and tree-shapers - in fragile harmony.", accent: "#7ee787", sort: 5 },
  { slug: "the-eternal-balance", title: "The Eternal Balance", tagline: "Moral epic. Sins vs virtues.", logline: "Seven sins against seven virtues, and one soul who must hold the balance of the world.", accent: "#c8102e", sort: 6 },
  { slug: "the-salt-market-witch", title: "The Salt Market Witch", tagline: "Mythic fantasy. The river remembers.", logline: "The river remembers, and a market witch relearns how to make the waters listen.", accent: "#4fd1c5", sort: 7 },
];

async function main() {
  const db = getDb();
  for (const w of worlds) {
    const poster = `/media/${w.slug}/poster.png`;
    await db
      .insert(series)
      .values({
        slug: w.slug,
        title: w.title,
        tagline: w.tagline,
        logline: w.logline,
        posterUrl: poster,
        heroUrl: poster,
        accentColor: w.accent,
        status: "coming-soon",
        sortOrder: w.sort,
      })
      .onConflictDoUpdate({
        target: series.slug,
        set: {
          title: w.title,
          tagline: w.tagline,
          logline: w.logline,
          posterUrl: poster,
          heroUrl: poster,
          accentColor: w.accent,
          status: "coming-soon",
          sortOrder: w.sort,
          updatedAt: new Date(),
        },
      });
  }
  await db
    .delete(upcomingWorlds)
    .where(
      inArray(upcomingWorlds.slug, [
        "the-veiled-divinity",
        "the-veiled-flame-saga",
        "alabaster-egg",
        "creature-of-aelyria",
      ]),
    );
  console.log("Worlds seeded as coming-soon series; upcoming_worlds cleaned.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
