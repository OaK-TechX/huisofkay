// View models: the exact, view-ready shapes the components render. Components
// consume ONLY these (never domain entities), so all mapping/formatting/href
// logic is done before the view and the view stays dumb (MVVM).

export interface MediaCardVM {
  readonly key: string;
  readonly href: string;
  readonly imageUrl: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly badge?: string;
}

export interface UpcomingCardVM {
  readonly key: string;
  readonly title: string;
  readonly note: string;
  readonly badge: string;
}

export interface HeroVM {
  readonly kicker: string;
  readonly title: string;
  readonly logline: string;
  readonly backgroundUrl: string;
  readonly playHref: string;
  readonly playLabel: string;
  readonly infoHref: string;
}

export interface MediaRowVM {
  readonly key: string;
  readonly title: string;
  readonly cards: readonly MediaCardVM[];
}

export interface UpcomingSectionVM {
  readonly title: string;
  readonly cards: readonly UpcomingCardVM[];
}

export interface HomeVM {
  readonly hero: HeroVM | null;
  readonly rows: readonly MediaRowVM[];
  readonly upcoming: UpcomingSectionVM;
}

export interface WatchVM {
  readonly seriesTitle: string;
  readonly episodeLabel: string;
  readonly title: string;
  readonly synopsis: string;
  readonly meta: string;
  readonly embedUrl: string;
  readonly vertical: boolean;
  readonly subscribeHref: string;
  readonly dropsHref: string;
  readonly documentTitle: string;
}
