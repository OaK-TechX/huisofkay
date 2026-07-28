// Inserts (or updates) the Zoba: The Reawakening coming-soon series.
// Placeholder built from the studio pantheon note (Zoba = the Reawakener, the
// red thread of fate); refine copy in /admin later. Run:
//   export $(grep DATABASE_URL .env | xargs) && pnpm exec tsx scripts/seed-zoba.ts
import { getDb } from "../src/lib/db";
import { series } from "../db/schema";

const poster = "/media/zoba-the-reawakening/poster.png";

const zoba = {
  slug: "zoba-the-reawakening",
  title: "Zoba: The Reawakening",
  tagline: "The red thread of fate.",
  logline:
    "The Reawakener returns. Bound to the red thread of fate, Zoba must rekindle what the world let die.",
  posterUrl: poster,
  heroUrl: poster,
  accentColor: "#e0456b",
  status: "coming-soon" as const,
  sortOrder: 1,
};

async function main() {
  const db = getDb();
  await db
    .insert(series)
    .values(zoba)
    .onConflictDoUpdate({
      target: series.slug,
      set: {
        title: zoba.title,
        tagline: zoba.tagline,
        logline: zoba.logline,
        posterUrl: zoba.posterUrl,
        heroUrl: zoba.heroUrl,
        accentColor: zoba.accentColor,
        status: zoba.status,
        sortOrder: zoba.sortOrder,
        updatedAt: new Date(),
      },
    });
  console.log("Zoba: The Reawakening seeded as coming-soon series.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
