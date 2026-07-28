"use client";

import { useState } from "react";

// A URL text field with an inline uploader (Netlify Blobs) + live preview.
export default function ImageUploadField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed.");
      setValue(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm text-paper/70 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded bg-ink px-3 py-2 ring-1 ring-white/15 focus:ring-crimson outline-none"
        />
        <label className="shrink-0 cursor-pointer rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
          {uploading ? "..." : "Upload"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      </div>
      {error ? <p className="text-crimson text-xs mt-1">{error}</p> : null}
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="preview" className="mt-2 h-16 rounded object-cover ring-1 ring-white/10" />
      ) : null}
    </div>
  );
}
