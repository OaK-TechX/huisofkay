import { container } from "@/lib/container";
import type { CountBucket, DailyCount } from "@/repositories/analytics.repository";

export const dynamic = "force-dynamic";

function Sparkline({ data }: { data: DailyCount[] }) {
  if (data.length === 0) {
    return <p className="text-paper/40 text-sm">No traffic yet.</p>;
  }
  const w = 720;
  const h = 120;
  const pad = 4;
  const max = Math.max(1, ...data.map((d) => d.count));
  const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;
  const pts = data.map((d, i) => {
    const x = pad + i * step;
    const y = h - pad - (d.count / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const first = pts[0];
  const last = pts[pts.length - 1];
  const area = `${line} L${last[0].toFixed(1)},${h} L${first[0].toFixed(1)},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <path d={area} fill="rgba(200,16,46,0.15)" />
      <path d={line} fill="none" stroke="#c8102e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function BarList({
  title,
  items,
  empty = "No data yet.",
}: {
  title: string;
  items: CountBucket[];
  empty?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="rounded-xl bg-ink-2 ring-1 ring-white/10 p-5">
      <h2 className="font-display text-xl mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-paper/40 text-sm">{empty}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.key} className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-paper/80 truncate mr-2">{i.key}</span>
                <span className="text-paper/50">{i.count}</span>
              </div>
              <div className="h-2 rounded bg-white/5">
                <div className="h-2 rounded bg-crimson" style={{ width: `${(i.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await container.analyticsService.getDashboard();
  const cards = [
    { label: "Total events", value: data.summary.total },
    { label: "Page views", value: data.summary.pageViews },
    { label: "Last 7 days", value: data.summary.last7 },
    { label: "Last 30 days", value: data.summary.last30 },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Analytics</h1>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl bg-ink-2 ring-1 ring-white/10 p-5">
            <div className="text-3xl font-display">{c.value}</div>
            <div className="text-sm text-paper/60 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-ink-2 ring-1 ring-white/10 p-5 mb-8">
        <h2 className="font-display text-xl mb-4">Traffic (last 30 days)</h2>
        <Sparkline data={data.daily} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <BarList title="Top episodes" items={data.topEpisodes} empty="No episode views yet." />
        <BarList title="Traffic sources" items={data.sources} />
        <BarList title="Event types" items={data.byType} />
      </div>

      <p className="text-xs text-paper/40 mt-6">
        Anonymous, cookie-free tracking. Data updates in real time.
      </p>
    </div>
  );
}
