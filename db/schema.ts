import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// ---- Catalog -------------------------------------------------------------

export const seriesStatus = pgEnum("series_status", ["streaming", "coming-soon"]);

export const series = pgTable("series", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  tagline: text("tagline").notNull().default(""),
  logline: text("logline").notNull().default(""),
  posterUrl: text("poster_url").notNull().default(""),
  heroUrl: text("hero_url").notNull().default(""),
  accentColor: text("accent_color").notNull().default("#C8102E"),
  status: seriesStatus("status").notNull().default("coming-soon"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  seriesSlug: text("series_slug")
    .notNull()
    .references(() => series.slug, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  number: integer("number").notNull().default(1),
  title: text("title").notNull(),
  synopsis: text("synopsis").notNull().default(""),
  runtimeSeconds: integer("runtime_seconds").notNull().default(0),
  publishedAt: text("published_at").notNull().default(""), // ISO date
  youtubeId: text("youtube_id").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  vertical: boolean("vertical").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const upcomingWorlds = pgTable("upcoming_worlds", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  note: text("note").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ---- Settings (key/value; e.g. featured_episode_slug) --------------------

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
});

// ---- Auth (Phase B) ------------------------------------------------------

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---- Analytics (Phase C) -------------------------------------------------

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // page_view | episode_play | ...
  path: text("path").notNull().default(""),
  episodeSlug: text("episode_slug"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  device: text("device"),
  country: text("country"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SeriesRow = typeof series.$inferSelect;
export type EpisodeRow = typeof episodes.$inferSelect;
export type UpcomingWorldRow = typeof upcomingWorlds.$inferSelect;
