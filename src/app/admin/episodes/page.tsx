import Link from "next/link";
import { container } from "@/lib/container";
import { deleteEpisodeAction, setFeaturedAction } from "@/app/admin/actions";
import DeleteForm from "@/components/admin/DeleteForm";

export const dynamic = "force-dynamic";

export default async function AdminEpisodes() {
  const [items, featured] = await Promise.all([
    container.catalogService.getStreamingEpisodes(),
    container.catalogService.getFeaturedEpisode(),
  ]);
  const featuredSlug = featured?.episode.slug;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Episodes</h1>
        <Link href="/admin/episodes/new" className="rounded bg-crimson px-4 py-2 text-sm font-medium text-white hover:brightness-110">
          New episode
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full text-sm">
          <thead className="bg-ink-2 text-paper/60">
            <tr>
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Series</th>
              <th className="text-left px-4 py-3">YouTube ID</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ series, episode }) => (
              <tr key={episode.slug} className="border-t border-white/5">
                <td className="px-4 py-3 text-paper/60">{episode.number}</td>
                <td className="px-4 py-3 font-medium">
                  {episode.title}
                  {featuredSlug === episode.slug ? (
                    <span className="ml-2 rounded bg-crimson/80 px-2 py-0.5 text-[10px] font-bold text-white">FEATURED</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-paper/60">{series.title}</td>
                <td className="px-4 py-3 text-paper/60 font-mono text-xs">{episode.youtubeId}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/episodes/${episode.slug}`} className="text-paper/80 hover:text-paper">
                      Edit
                    </Link>
                    {featuredSlug === episode.slug ? null : (
                      <form action={setFeaturedAction}>
                        <input type="hidden" name="slug" value={episode.slug} />
                        <button type="submit" className="text-paper/60 hover:text-paper text-sm">
                          Set featured
                        </button>
                      </form>
                    )}
                    <DeleteForm action={deleteEpisodeAction} slug={episode.slug} />
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
