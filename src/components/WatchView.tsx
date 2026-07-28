import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import type { WatchVM } from "@/viewmodels/catalog.vm";

// Pure view. The player container adapts to vertical (Shorts) vs landscape.
export default function WatchView({ vm }: { vm: WatchVM }) {
  return (
    <div className="pt-16">
      <JsonLd data={vm.jsonLd} />
      <div className="bg-black flex justify-center">
        {vm.vertical ? (
          <div className="relative w-full max-w-[420px] aspect-[9/16] max-h-[85vh]">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={vm.embedUrl}
              title={`${vm.seriesTitle} ${vm.episodeLabel}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative w-full max-w-5xl aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={vm.embedUrl}
              title={`${vm.seriesTitle} ${vm.episodeLabel}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <p className="text-crimson font-semibold tracking-widest text-sm">
          {vm.seriesTitle}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
          {vm.episodeLabel}: {vm.title}
        </h1>
        <p className="mt-3 text-paper/80 max-w-2xl">{vm.synopsis}</p>
        <p className="mt-2 text-sm text-paper/50">{vm.meta}</p>

        {vm.nextHref ? (
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={vm.nextHref}
              className="inline-flex w-fit items-center gap-2 rounded bg-crimson px-6 py-3 text-base font-semibold text-white transition hover:brightness-110"
            >
              <span aria-hidden>&#9654;</span> Play Next
            </Link>
            <p className="text-sm text-paper/50">
              {vm.nextIsReplay
                ? "Loops back to the start - new episodes weekly."
                : `Up next: ${vm.nextSeriesTitle} - ${vm.nextEpisodeLabel}`}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={vm.subscribeHref}
            target="_blank"
            rel="noopener"
            className="rounded bg-white/15 px-5 py-2 text-sm font-medium hover:bg-white/25 transition"
          >
            Subscribe on YouTube
          </a>
          <Link
            href={vm.dropsHref}
            className="rounded bg-white/10 px-5 py-2 text-sm font-semibold text-paper hover:bg-white/20 transition"
          >
            Get episode drops
          </Link>
        </div>
      </div>
    </div>
  );
}
