"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Client-only scroller: a horizontally scrollable strip with Netflix-style
// hover arrows. Kept generic (takes children) so views stay dumb - MediaRow
// just wraps its cards in this.
export default function ScrollRow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className={`absolute left-0 top-0 bottom-2 z-20 hidden w-14 items-center justify-start bg-gradient-to-r from-ink via-ink/80 to-transparent pl-1 transition-opacity duration-200 sm:flex ${
          atStart ? "pointer-events-none opacity-0" : "opacity-0 group-hover/row:opacity-100"
        }`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-black/70 text-2xl leading-none text-paper ring-1 ring-white/20 transition hover:bg-black hover:ring-crimson/70">
          &#8249;
        </span>
      </button>

      <div
        ref={ref}
        className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className={`absolute right-0 top-0 bottom-2 z-20 hidden w-14 items-center justify-end bg-gradient-to-l from-ink via-ink/80 to-transparent pr-1 transition-opacity duration-200 sm:flex ${
          atEnd ? "pointer-events-none opacity-0" : "opacity-0 group-hover/row:opacity-100"
        }`}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-black/70 text-2xl leading-none text-paper ring-1 ring-white/20 transition hover:bg-black hover:ring-crimson/70">
          &#8250;
        </span>
      </button>
    </div>
  );
}
