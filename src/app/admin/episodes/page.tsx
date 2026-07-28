import { container } from "@/lib/container";

export const dynamic = "force-dynamic";

export default async function AdminEpisodes() {
  const items = await container.catalogService.getStreamingEpisodes();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Episodes</h1>
      <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-2 text-paper/60">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Series</th>
              <th className="text-left px-4 py-3">YouTube ID</th>
              <th className="text-left px-4 py-3">Slug</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ series, episode }) => (
              <tr key={episode.slug} className="border-t border-white/5">
                <td className="px-4 py-3 text-paper/60">{episode.number}</td>
                <td className="px-4 py-3 font-medium">{episode.title}</td>
                <td className="px-4 py-3 text-paper/60">{series.title}</td>
                <td className="px-4 py-3 text-paper/60 font-mono text-xs">{episode.youtubeId}</td>
                <td className="px-4 py-3 text-paper/60">{episode.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-paper/40 mt-4">Add / edit / delete controls land in the next step (Phase B.2).</p>
    </div>
  );
}
