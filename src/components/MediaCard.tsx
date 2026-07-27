import Image from "next/image";
import Link from "next/link";
import type { MediaCardVM } from "@/viewmodels/catalog.vm";

// Pure view. One card = one MediaCardVM.
export default function MediaCard({ card }: { card: MediaCardVM }) {
  return (
    <Link href={card.href} className="group relative w-[150px] sm:w-[190px] shrink-0 snap-start">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-ink-2 ring-1 ring-white/10 transition group-hover:ring-crimson/70">
        <Image
          src={card.imageUrl}
          alt={card.title}
          fill
          sizes="190px"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {card.badge ? (
          <span className="absolute top-2 left-2 rounded bg-crimson/90 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
            {card.badge}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm font-medium text-paper truncate">{card.title}</p>
      {card.subtitle ? (
        <p className="text-xs text-paper/60 truncate">{card.subtitle}</p>
      ) : null}
    </Link>
  );
}
