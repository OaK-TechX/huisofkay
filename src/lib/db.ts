import { drizzle } from "drizzle-orm/neon-http";
import { getConnectionString } from "@netlify/database";

// Drizzle client over Netlify DB (Neon). We use core queries with explicit
// table imports, so no relational `schema` option is needed. Lazily built +
// cached. Only call getDb() when hasDatabase() is true.

function createClient() {
  return drizzle(getConnectionString());
}

let cached: ReturnType<typeof createClient> | undefined;

export function hasDatabase(): boolean {
  return Boolean(process.env.NETLIFY_DATABASE_URL);
}

export function getDb() {
  if (!cached) {
    cached = createClient();
  }
  return cached;
}
