// Single source of truth for site-wide constants. Keeps brand, links, and
// integration ids out of components (DRY). Change here, changes everywhere.

export interface NamedLink {
  readonly label: string;
  readonly href: string;
}

export const siteConfig = {
  name: "Huis of Kay",
  tagline: "Epic fantasy worlds. One pantheon.",
  url: "https://huisofkay.studio",
  description:
    "AI-assisted animation studio. Stream INKBORNE and the worlds of Huis of Kay. New episodes weekly.",
  facebookDomainVerification: "3ukup5ycjobrok4jkmkvxsvivcezlp",
  featuredEpisodeSlug: "inkborne-first-stroke",
  brand: {
    logoUrl: "/brand/logo.png",
    wordmarkUrl: "/brand/wordmark.png",
    bannerUrl: "/brand/banner.png",
  },
  newsletter: {
    beehiivFormUrl:
      "https://subscribe-forms.beehiiv.com/59d7d900-a729-4ff8-a143-80a06f60f79c",
  },
  socials: [
    { label: "YouTube", href: "https://youtube.com/@huisofkay" },
    { label: "TikTok", href: "https://tiktok.com/@huisofkay" },
    { label: "Instagram", href: "https://instagram.com/huisofkay" },
    { label: "Facebook", href: "https://facebook.com/huisofkay" },
  ] as readonly NamedLink[],
  legal: [
    { label: "Terms", href: "/legal/content_license.html" },
    { label: "Privacy", href: "/legal/privacy_policy.html" },
    { label: "Disclaimer", href: "/legal/legal_disclaimer.html" },
  ] as readonly NamedLink[],
} as const;

export type SiteConfig = typeof siteConfig;
