import { container } from "@/lib/container";
import HomeView from "@/components/HomeView";

// Route = controller: ask the presenter for a view model, hand it to the view.
export default async function HomePage() {
  const vm = await container.catalogPresenter.buildHome();
  return <HomeView vm={vm} />;
}
