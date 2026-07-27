import Image from "next/image";
import Link from "next/link";
import type { HeroVM } from "@/viewmodels/catalog.vm";

// Pure view. Receives a fully-prepared HeroVM; renders it, computes nothing.
export default function HeroBanner({ hero }: { hero: HeroVM }) {
  return (
    <section className="relative h-[88vh] min-h-[540px] w-full">
      <Image
        src={hero.backgroundUrl}
        alt={hero.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
      <div className="relative z-10 mx-auto max-w-7xl h-full px-4 sm:px-6 flex flex-col justify-end pb-24">
        <p className="text-crimson font-semibold tracking-[0.25em] text-xs sm:text-sm">
          {hero.kicker}
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-black text-paper mt-2 drop-shadow">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-paper/85 text-base sm:text-lg">
          {hero.logline}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={hero.playHref}
            className="rounded bg-crimson px-6 py-3 font-semibold text-white hover:brightness-110 transition"
          >
            &#9654;&nbsp; {hero.playLabel}
          </Link>
          <Link
            href={hero.infoHref}
            className="rounded bg-white/15 px-6 py-3 font-semibold text-paper backdrop-blur hover:bg-white/25 transition"
          >
            More info
          </Link>
        </div>
      </div>
    </section>
  );
}
