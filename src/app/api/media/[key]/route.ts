import { NextResponse, type NextRequest } from "next/server";
import { mediaStore } from "@/lib/blobs";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;
  const result = await mediaStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!result || !result.data) {
    return new NextResponse("Not found", { status: 404 });
  }
  const contentType =
    (result.metadata?.contentType as string | undefined) ?? "application/octet-stream";
  return new NextResponse(result.data as ArrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
