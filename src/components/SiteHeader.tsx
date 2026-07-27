import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

// Pure view. Reads brand + routes from config, renders nothing computed.
export default function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-ink/95 via-ink/60 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={routes.home()} className="flex items-center gap-3">
          <Image
            src={siteConfig.brand.logoUrl}
            alt={siteConfig.name}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg tracking-wide text-paper hidden sm:block">
            HUIS OF KAY
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-paper/80">
          <Link href={routes.home()} className="hover:text-paper transition">
            Home
          </Link>
          <Link href={routes.seriesAnchor()} className="hover:text-paper transition">
            Series
          </Link>
          <Link
            href={routes.watch(siteConfig.featuredEpisodeSlug)}
            className="rounded bg-crimson px-4 py-1.5 font-medium text-white hover:brightness-110 transition"
          >
            Watch
          </Link>
        </nav>
      </div>
    </header>
  );
}
