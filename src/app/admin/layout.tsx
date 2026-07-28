import Link from "next/link";
import { auth, signOut } from "@/auth";

// Admin shell. Middleware already gates /admin (except /admin/login), so here we
// only render the nav when there is a session (i.e. not on the login page).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-screen pt-16">
      {session?.user ? (
        <div className="border-b border-white/10 bg-ink-2">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/admin" className="font-display text-lg text-paper">
                Admin
              </Link>
              <Link href="/admin/series" className="text-paper/70 hover:text-paper">
                Series
              </Link>
              <Link href="/admin/episodes" className="text-paper/70 hover:text-paper">
                Episodes
              </Link>
              <Link href="/admin/analytics" className="text-paper/70 hover:text-paper">
                Analytics
              </Link>
              <Link href="/" className="text-paper/50 hover:text-paper">
                View site
              </Link>
            </nav>
            <div className="flex items-center gap-4 text-sm text-paper/60">
              <span className="hidden sm:inline">{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button className="rounded bg-white/10 px-3 py-1 text-paper/80 hover:bg-white/20">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
