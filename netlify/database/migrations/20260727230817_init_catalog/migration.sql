CREATE TYPE "series_status" AS ENUM('streaming', 'coming-soon');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"type" text NOT NULL,
	"path" text DEFAULT '' NOT NULL,
	"episode_slug" text,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"device" text,
	"country" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "episodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"series_slug" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"number" integer DEFAULT 1 NOT NULL,
	"title" text NOT NULL,
	"synopsis" text DEFAULT '' NOT NULL,
	"runtime_seconds" integer DEFAULT 0 NOT NULL,
	"published_at" text DEFAULT '' NOT NULL,
	"youtube_id" text NOT NULL,
	"thumbnail_url" text DEFAULT '' NOT NULL,
	"vertical" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "series" (
	"slug" text PRIMARY KEY,
	"title" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"logline" text DEFAULT '' NOT NULL,
	"poster_url" text DEFAULT '' NOT NULL,
	"hero_url" text DEFAULT '' NOT NULL,
	"accent_color" text DEFAULT '#C8102E' NOT NULL,
	"status" "series_status" DEFAULT 'coming-soon'::"series_status" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY,
	"value" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upcoming_worlds" (
	"slug" text PRIMARY KEY,
	"title" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_series_slug_series_slug_fkey" FOREIGN KEY ("series_slug") REFERENCES "series"("slug") ON DELETE CASCADE;