"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Fires an anonymous page_view to /track on every route change. No cookies, no
// PII. Skips /admin. Must be wrapped in <Suspense> (uses useSearchParams).
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const episodeSlug = pathname.startsWith("/watch/")
      ? pathname.slice("/watch/".length)
      : null;

    const payload = {
      type: "page_view",
      path: pathname,
      episodeSlug,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
    };

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* best-effort */
    });
  }, [pathname, searchParams]);

  return null;
}
