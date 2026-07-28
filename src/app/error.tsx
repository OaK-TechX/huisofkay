"use client";

import { useEffect } from "react";
import Link from "next/link";

// Segment error boundary for the public app.
export default function AppError({
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-16">
      <p className="text-crimson font-semibold tracking-widest text-sm">SOMETHING BROKE</p>
      <h1 className="font-display text-4xl mt-2 mb-3">A stroke went astray</h1>
      <p className="text-paper/60 max-w-md">
        An unexpected error occurred. Please try again in a moment.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded bg-crimson px-5 py-2 font-semibold text-white hover:brightness-110"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded bg-white/10 px-5 py-2 font-semibold text-paper hover:bg-white/20"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
