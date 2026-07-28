import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import SeriesForm from "@/components/admin/SeriesForm";
import DeleteForm from "@/components/admin/DeleteForm";
import { deleteSeriesAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditSeries({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await container.catalogService.getSeries();
  const series = all.find((s) => s.slug === slug);
  if (!series) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">Edit series</h1>
        <DeleteForm action={deleteSeriesAction} slug={series.slug} label="Delete series" />
      </div>
      <SeriesForm series={series} />
    </div>
  );
}
