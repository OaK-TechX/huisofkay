import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import EpisodeForm from "@/components/admin/EpisodeForm";
import DeleteForm from "@/components/admin/DeleteForm";
import { deleteEpisodeAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditEpisode({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [found, series] = await Promise.all([
    container.catalogService.findEpisodeBySlug(slug),
    container.catalogService.getSeries(),
  ]);
  if (!found) notFound();

  const seriesOptions = series.map((s) => ({ value: s.slug, label: s.title }));
  const episode = { ...found.episode, seriesSlug: found.series.slug };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Edit episode</h1>
        <DeleteForm action={deleteEpisodeAction} slug={found.episode.slug} label="Delete episode" />
      </div>
      <EpisodeForm episode={episode} seriesOptions={seriesOptions} />
    </div>
  );
}
