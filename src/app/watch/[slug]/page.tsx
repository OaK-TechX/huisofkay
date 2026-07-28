import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import WatchView from "@/components/WatchView";

type RouteParams = { slug: string };

// ISR so watch pages reflect DB edits at runtime.
export const revalidate = 60;

// Pre-render a static page per streaming episode.
export async function generateStaticParams(): Promise<RouteParams[]> {
  const episodes = await container.catalogService.getStreamingEpisodes();
  return episodes.map(({ episode }) => ({ slug: episode.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vm = await container.catalogPresenter.buildWatch(slug);
  if (!vm) return {};
  return {
    title: vm.documentTitle,
    description: vm.synopsis,
    alternates: { canonical: vm.canonicalPath },
    openGraph: {
      title: vm.documentTitle,
      description: vm.synopsis,
      url: vm.canonicalPath,
      type: "video.other",
      images: [vm.ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: vm.documentTitle,
      description: vm.synopsis,
      images: [vm.ogImageUrl],
    },
  };
}

// Route = controller: resolve the slug to a WatchVM, or 404.
export default async function WatchPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const vm = await container.catalogPresenter.buildWatch(slug);
  if (!vm) notFound();
  return <WatchView vm={vm} />;
}
