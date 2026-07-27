// Centralized URL builders. No route string is hand-typed inside a component
// (DRY + single place to change the URL scheme).

export const routes = {
  home: (): string => "/",
  seriesAnchor: (): string => "/#series",
  subscribeAnchor: (): string => "/#subscribe",
  watch: (episodeSlug: string): string => `/watch/${episodeSlug}`,
  youtubeEmbed: (youtubeId: string): string =>
    `https://www.youtube.com/embed/${youtubeId}?rel=0`,
  youtubeChannel: (): string => "https://youtube.com/@huisofkay",
} as const;
