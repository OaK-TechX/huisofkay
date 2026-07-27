import HeroBanner from "@/components/HeroBanner";
import MediaRow from "@/components/MediaRow";
import UpcomingSection from "@/components/UpcomingSection";
import type { HomeVM } from "@/viewmodels/catalog.vm";

// Pure composition of the home page from its view model. No data access, no logic.
export default function HomeView({ vm }: { vm: HomeVM }) {
  return (
    <>
      {vm.hero ? <HeroBanner hero={vm.hero} /> : null}
      <div id="series" className="mx-auto max-w-7xl pb-10 relative z-10 -mt-6">
        {vm.rows.map((row) => (
          <MediaRow key={row.key} row={row} />
        ))}
        <UpcomingSection section={vm.upcoming} />
      </div>
    </>
  );
}
