"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { container } from "@/lib/container";
import type {
  EpisodeInput,
  SeriesInput,
} from "@/repositories/catalog-write.repository";

export type ActionState = { error?: string } | undefined;

async function requireAuth(): Promise<void> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function num(fd: FormData, key: string): number {
  const n = Number(fd.get(key));
  return Number.isFinite(n) ? n : 0;
}
function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

function revalidateCatalog(): void {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/series");
  revalidatePath("/admin/episodes");
}

// ---- Series --------------------------------------------------------------

export async function saveSeriesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();
  const input: SeriesInput = {
    slug: str(formData, "slug"),
    title: str(formData, "title"),
    tagline: str(formData, "tagline"),
    logline: str(formData, "logline"),
    posterUrl: str(formData, "posterUrl"),
    heroUrl: str(formData, "heroUrl"),
    accentColor: str(formData, "accentColor") || "#C8102E",
    status: (str(formData, "status") as SeriesInput["status"]) || "coming-soon",
    sortOrder: num(formData, "sortOrder"),
  };
  try {
    await container.adminCatalogService.saveSeries(input);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save series." };
  }
  revalidateCatalog();
  redirect("/admin/series");
}

export async function deleteSeriesAction(formData: FormData): Promise<void> {
  await requireAuth();
  await container.adminCatalogService.deleteSeries(str(formData, "slug"));
  revalidateCatalog();
  redirect("/admin/series");
}

// ---- Episodes ------------------------------------------------------------

export async function saveEpisodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();
  const input: EpisodeInput = {
    slug: str(formData, "slug"),
    seriesSlug: str(formData, "seriesSlug"),
    number: num(formData, "number"),
    title: str(formData, "title"),
    synopsis: str(formData, "synopsis"),
    runtimeSeconds: num(formData, "runtimeSeconds"),
    publishedAt: str(formData, "publishedAt"),
    youtubeId: str(formData, "youtubeId"),
    thumbnailUrl: str(formData, "thumbnailUrl"),
    vertical: bool(formData, "vertical"),
    sortOrder: num(formData, "sortOrder"),
  };
  try {
    await container.adminCatalogService.saveEpisode(input);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to save episode." };
  }
  revalidateCatalog();
  redirect("/admin/episodes");
}

export async function deleteEpisodeAction(formData: FormData): Promise<void> {
  await requireAuth();
  await container.adminCatalogService.deleteEpisode(str(formData, "slug"));
  revalidateCatalog();
  redirect("/admin/episodes");
}

export async function setFeaturedAction(formData: FormData): Promise<void> {
  await requireAuth();
  await container.adminCatalogService.setFeaturedEpisode(str(formData, "slug"));
  revalidateCatalog();
  redirect("/admin/episodes");
}
