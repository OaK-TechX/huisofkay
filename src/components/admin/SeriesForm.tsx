"use client";

import { useActionState } from "react";
import { saveSeriesAction, type ActionState } from "@/app/admin/actions";
import { Field, TextArea, Select } from "@/components/admin/fields";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { Series } from "@/domain/models";

export default function SeriesForm({ series }: { series?: Series }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveSeriesAction,
    undefined,
  );
  const isEdit = Boolean(series);

  return (
    <form action={action} className="space-y-4 max-w-2xl">
      {state?.error ? (
        <p className="rounded bg-crimson/20 text-crimson px-3 py-2 text-sm">{state.error}</p>
      ) : null}
      <Field label="Slug" name="slug" defaultValue={series?.slug} readOnly={isEdit} required placeholder="e.g. inkborne" />
      <Field label="Title" name="title" defaultValue={series?.title} required />
      <Field label="Tagline" name="tagline" defaultValue={series?.tagline} />
      <TextArea label="Logline" name="logline" defaultValue={series?.logline} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploadField label="Poster" name="posterUrl" defaultValue={series?.posterUrl} placeholder="/media/.../poster.png" />
        <ImageUploadField label="Hero" name="heroUrl" defaultValue={series?.heroUrl} placeholder="/media/.../hero.png" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Accent color" name="accentColor" defaultValue={series?.accentColor ?? "#C8102E"} />
        <Select
          label="Status"
          name="status"
          defaultValue={series?.status ?? "coming-soon"}
          options={[
            { value: "streaming", label: "streaming" },
            { value: "coming-soon", label: "coming-soon" },
          ]}
        />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={0} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-crimson px-5 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save series"}
      </button>
    </form>
  );
}
