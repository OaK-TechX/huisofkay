"use client";

import { useActionState } from "react";
import { saveEpisodeAction, type ActionState } from "@/app/admin/actions";
import { Field, TextArea, Select, Checkbox } from "@/components/admin/fields";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Episode } from "@/domain/models";

export interface EpisodeFormValues extends Partial<Episode> {
  seriesSlug?: string;
}

export default function EpisodeForm({
  episode,
  seriesOptions,
}: {
  episode?: EpisodeFormValues;
  seriesOptions: { value: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveEpisodeAction,
    undefined,
  );
  const isEdit = Boolean(episode?.slug);

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      {state?.error ? (
        <p className="rounded bg-crimson/20 text-crimson px-3 py-2 text-sm">{state.error}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug" name="slug" defaultValue={episode?.slug} readOnly={isEdit} required placeholder="e.g. inkborne-first-stroke" />
        <Select label="Series" name="seriesSlug" defaultValue={episode?.seriesSlug} options={seriesOptions} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Number" name="number" type="number" defaultValue={episode?.number ?? 1} required />
        <Field label="Runtime (seconds)" name="runtimeSeconds" type="number" defaultValue={episode?.runtimeSeconds ?? 0} />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={0} />
      </div>
      <Field label="Title" name="title" defaultValue={episode?.title} required />
      <TextArea label="Synopsis" name="synopsis" defaultValue={episode?.synopsis} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="YouTube ID" name="youtubeId" defaultValue={episode?.youtubeId} required placeholder="e.g. 1btIw-_eisg" />
        <Field label="Published at (ISO date)" name="publishedAt" defaultValue={episode?.publishedAt} placeholder="2026-07-27" />
      </div>
      <ImageUploadField label="Thumbnail" name="thumbnailUrl" defaultValue={episode?.thumbnailUrl} placeholder="/media/.../ep.png" />
      <Checkbox label="Vertical (9:16 Short)" name="vertical" defaultChecked={episode?.vertical ?? true} />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-crimson px-5 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save episode"}
      </button>
    </form>
  );
}
