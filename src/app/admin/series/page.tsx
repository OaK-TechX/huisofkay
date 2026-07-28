import Link from "next/link";
import { container } from "@/lib/container";
import { deleteSeriesAction } from "@/app/admin/actions";
import DeleteForm from "@/components/admin/DeleteForm";

export const dynamic = "force-dynamic";

export default async function AdminSeries() {
  const series = await container.catalogService.getSeries();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Series</h1>
        <Link href="/admin/series/new" className="rounded bg-crimson px-4 py-2 text-sm font-medium text-white hover:brightness-110">
          New series
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-2 text-paper/60">
            <tr>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Episodes</th>
              <th className="text-right px-4 py-3">Actions</th>
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
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/series/${s.slug}`} className="text-paper/80 hover:text-paper">
                      Edit
                    </Link>
                    <DeleteForm action={deleteSeriesAction} slug={s.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
