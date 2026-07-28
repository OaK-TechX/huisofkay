import Link from "next/link";
import { container } from "@/lib/container";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [series, episodes, upcoming] = await Promise.all([
    container.catalogService.getSeries(),
    container.catalogService.getStreamingEpisodes(),
    container.catalogService.getUpcomingWorlds(),
  ]);

  const stats = [
    { label: "Series", value: series.length, href: "/admin/series" },
    { label: "Episodes", value: episodes.length, href: "/admin/episodes" },
    { label: "Upcoming worlds", value: upcoming.length, href: "/admin/series" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-1">Dashboard</h1>
      <p className="text-paper/60 mb-8">Manage the Huis of Kay catalog.</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl bg-ink-2 ring-1 ring-white/10 p-5 hover:ring-crimson/60 transition"
          >
            <div className="text-4xl font-display">{s.value}</div>
            <div className="text-sm text-paper/60 mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-ink-2 ring-1 ring-white/10 p-5">
        <h2 className="font-display text-xl mb-3">Quick actions</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/admin/episodes" className="rounded bg-crimson px-4 py-2 font-medium text-white hover:brightness-110">
            Manage episodes
          </Link>
          <Link href="/admin/series" className="rounded bg-white/10 px-4 py-2 hover:bg-white/20">
            Manage series
          </Link>
        </div>
        <p className="text-xs text-paper/40 mt-4">
          Content editing and the analytics dashboard land in the next steps.
        </p>
      </div>
    </div>
  );
}
