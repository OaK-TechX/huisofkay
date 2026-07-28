import { NextResponse, type NextRequest } from "next/server";
import { container } from "@/lib/container";
import { hasDatabase } from "@/lib/db";

export const runtime = "nodejs";

function s(v: unknown, max: number): string | null {
  if (v === undefined || v === null) return null;
  const str = String(v).trim();
  return str ? str.slice(0, max) : null;
}

function deviceFromUA(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function countryFromHeaders(req: NextRequest): string | null {
  const geo = req.headers.get("x-nf-geo");
  if (geo) {
    try {
      const decoded = JSON.parse(Buffer.from(geo, "base64").toString("utf8"));
      return decoded?.country?.code ?? null;
    } catch {
      /* ignore */
    }
  }
  return req.headers.get("x-country");
}

export async function POST(req: NextRequest) {
  // Analytics must never break the client; always answer 200.
  if (!hasDatabase()) return NextResponse.json({ ok: false });
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const ua = req.headers.get("user-agent") ?? "";
    await container.analyticsService.track({
      type: s(body.type, 40) ?? "page_view",
      path: s(body.path, 512) ?? "",
      episodeSlug: s(body.episodeSlug, 128),
      referrer: s(body.referrer, 512),
      utmSource: s(body.utmSource, 128),
      utmMedium: s(body.utmMedium, 128),
      utmCampaign: s(body.utmCampaign, 128),
      device: deviceFromUA(ua),
      country: countryFromHeaders(req),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
