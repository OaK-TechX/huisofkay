import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-16">
      <p className="text-crimson font-semibold tracking-widest text-sm">404</p>
      <h1 className="font-display text-4xl mt-2 mb-3">Lost in the ink</h1>
      <p className="text-paper/60 max-w-md">This page does not exist, or has been erased.</p>
      <Link
        href="/"
        className="mt-6 rounded bg-crimson px-5 py-2 font-semibold text-white hover:brightness-110"
      >
        Back home
      </Link>
    </div>
  );
}
