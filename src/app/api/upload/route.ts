import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { putImage } from "@/lib/blobs";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image too large (8MB max)." }, { status: 400 });
    }
    const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1];
    const key = await putImage(await file.arrayBuffer(), file.type, ext);
    return NextResponse.json({ url: `/api/media/${key}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 500 },
    );
  }
}
