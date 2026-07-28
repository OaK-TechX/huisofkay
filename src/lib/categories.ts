// Catalog categories (presentation grouping, Netflix/Prime-style rows). Kept as
// a config module so the row taxonomy lives in one place and the presenter stays
// logic-light. A series with no mapping falls into DEFAULT_CATEGORY so nothing
// ever silently disappears from the home page.

// The order categories appear as rows on the home page.
export const CATEGORY_ORDER: readonly string[] = [
  "Studio Originals",
  "Mythic Epics",
  "Urban & Multiverse Fantasy",
  "Progression Fantasy",
  "Worldbuilding & Folklore",
];

export const DEFAULT_CATEGORY = "More from the Studio";

// slug -> category. Add a line when a new series ships.
const CATEGORY_BY_SLUG: Readonly<Record<string, string>> = {
  inkborne: "Studio Originals",
  "zoba-the-reawakening": "Studio Originals",
  "the-quantum-omen": "Mythic Epics",
  "the-eternal-balance": "Mythic Epics",
  "the-veiled-divinity": "Urban & Multiverse Fantasy",
  "the-veiled-flame-saga": "Urban & Multiverse Fantasy",
  "alabaster-egg": "Progression Fantasy",
  "creature-of-aelyria": "Worldbuilding & Folklore",
  "the-salt-market-witch": "Worldbuilding & Folklore",
};

export function categoryForSlug(slug: string): string {
  return CATEGORY_BY_SLUG[slug] ?? DEFAULT_CATEGORY;
}

// Deterministic row order: known categories first (CATEGORY_ORDER), then any
// leftover categories in first-seen order.
export function orderedCategories(present: readonly string[]): string[] {
  const seen = new Set(present);
  const ordered = CATEGORY_ORDER.filter((c) => seen.has(c));
  const extras = present.filter((c) => !CATEGORY_ORDER.includes(c));
  return [...ordered, ...Array.from(new Set(extras))];
}
