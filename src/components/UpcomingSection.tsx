import type { UpcomingSectionVM } from "@/viewmodels/catalog.vm";

// Pure view. Text-tile placeholders for worlds without art yet.
export default function UpcomingSection({ section }: { section: UpcomingSectionVM }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-paper mb-4 px-4 sm:px-6">{section.title}</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 sm:px-6 pb-2 snap-x">
        {section.cards.map((card) => (
          <div key={card.key} className="w-[150px] sm:w-[190px] shrink-0 snap-start">
            <div className="relative aspect-[2/3] rounded-lg bg-gradient-to-br from-ink-2 to-black ring-1 ring-white/10 flex items-center justify-center p-4 text-center">
              <span className="font-display text-lg text-paper/90">{card.title}</span>
              <span className="absolute top-2 left-2 rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-paper/70">
                {card.badge}
              </span>
            </div>
            <p className="mt-2 text-xs text-paper/60">{card.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
