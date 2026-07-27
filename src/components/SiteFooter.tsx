import { siteConfig } from "@/config/site";

// Pure view. Socials + legal from config. (No newsletter for now.)
export default function SiteFooter() {
  return (
    <footer id="subscribe" className="border-t border-white/10 bg-ink-2 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-display text-2xl text-paper">{siteConfig.tagline}</h2>
          <p className="mt-2 text-sm text-paper/70 max-w-md">
            New episodes weekly. Follow the studio to catch every drop.
          </p>
          <nav className="mt-5 flex flex-wrap gap-5 text-sm text-paper/80">
            {siteConfig.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener"
                className="hover:text-crimson transition"
              >
                {social.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="md:text-right">
          <nav className="flex md:justify-end gap-4 text-xs text-paper/50">
            {siteConfig.legal.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-paper/80">
                {link.label}
              </a>
            ))}
          </nav>
          <p className="mt-6 text-xs text-paper/40">(c) 2026 {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
