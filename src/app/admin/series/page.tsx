import { container } from "@/lib/container";

export const dynamic = "force-dynamic";

export default async function AdminSeries() {
  const series = await container.catalogService.getSeries();
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Series</h1>
      <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-2 text-paper/60">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Episodes</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.slug} className="border-t border-white/5">
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 text-paper/60">{s.slug}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{s.status}</span>
                </td>
                <td className="px-4 py-3 text-paper/60">{s.episodes.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-paper/40 mt-4">Add / edit / delete controls land in the next step (Phase B.2).</p>
    </div>
  );
}
