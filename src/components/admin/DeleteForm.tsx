"use client";

// Confirm-on-submit delete form. Takes a server action as a prop.
export default function DeleteForm({
  action,
  slug,
  label = "Delete",
}: {
  action: (formData: FormData) => Promise<void>;
  slug: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="text-crimson hover:underline text-sm">
        {label}
      </button>
    </form>
  );
}
