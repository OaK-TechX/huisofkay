"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm mt-10">
      <div className="flex flex-col items-center mb-6">
        <Image src="/brand/logo.png" alt="Huis of Kay" width={56} height={56} className="rounded-full" />
        <h1 className="font-display text-2xl mt-3">Admin</h1>
        <p className="text-sm text-paper/60">Huis of Kay studio</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-ink-2 ring-1 ring-white/10 p-6">
        <div>
          <label className="block text-sm text-paper/70 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded bg-ink px-3 py-2 ring-1 ring-white/15 focus:ring-crimson outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-paper/70 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded bg-ink px-3 py-2 ring-1 ring-white/15 focus:ring-crimson outline-none"
          />
        </div>
        {error ? <p className="text-sm text-crimson">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-crimson px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
