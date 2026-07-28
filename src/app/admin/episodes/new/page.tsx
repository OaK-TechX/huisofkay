import { container } from "@/lib/container";
import EpisodeForm from "@/components/admin/EpisodeForm";

export const dynamic = "force-dynamic";

export default async function NewEpisode() {
  const series = await container.catalogService.getSeries();
  const seriesOptions = series.map((s) => ({ value: s.slug, label: s.title }));
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">New episode</h1>
      <EpisodeForm seriesOptions={seriesOptions} />
    </div>
  );
}
