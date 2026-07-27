import { drizzle } from "drizzle-orm/neon-http";

// Drizzle client over Neon (direct connection string). We use core queries with
// explicit table imports, so no relational `schema` option is needed. Lazily
// built + cached. Only call getDb() when hasDatabase() is true.

function connectionString(): string {
  const url = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

function createClient() {
  return drizzle(connectionString());
}

let cached: ReturnType<typeof createClient> | undefined;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL);
}

export function getDb() {
  if (!cached) {
    cached = createClient();
  }
  return cached;
}
