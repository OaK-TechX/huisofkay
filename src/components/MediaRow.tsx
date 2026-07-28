import MediaCard from "@/components/MediaCard";
import ScrollRow from "@/components/ScrollRow";
import type { MediaRowVM } from "@/viewmodels/catalog.vm";

// Pure view. A titled, horizontally-scrollable strip of cards (arrows via ScrollRow).
export default function MediaRow({ row }: { row: MediaRowVM }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-paper mb-4 px-4 sm:px-6">{row.title}</h2>
      <ScrollRow>
        {row.cards.map((card) => (
          <MediaCard key={card.key} card={card} />
        ))}
      </ScrollRow>
    </section>
  );
}
