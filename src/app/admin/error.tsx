"use client";

import { useEffect } from "react";

// Admin section error boundary (keeps DB / action errors contained + readable).
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-16 text-center">
      <h1 className="font-display text-3xl mb-2">Admin error</h1>
      <p className="text-paper/60 max-w-md mx-auto">
        {error?.message || "Something went wrong."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-crimson px-5 py-2 font-semibold text-white hover:brightness-110"
      >
        Try again
      </button>
    </div>
  );
}
