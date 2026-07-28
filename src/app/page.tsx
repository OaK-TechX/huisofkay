import { container } from "@/lib/container";
import HomeView from "@/components/HomeView";

// ISR: regenerate from the DB at runtime (where the connection exists) so the
// site converges to the database even when the build prerenders the fallback.
export const revalidate = 60;

// Route = controller: ask the presenter for a view model, hand it to the view.
export default async function HomePage() {
  const vm = await container.catalogPresenter.buildHome();
  return <HomeView vm={vm} />;
}
