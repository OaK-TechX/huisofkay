import { getStore } from "@netlify/blobs";

// Netlify Blobs store for admin-uploaded media. On Netlify the site context is
// auto-injected; keys are opaque uuids served back via /api/media/[key].
const STORE_NAME = "media";

export function mediaStore() {
  return getStore(STORE_NAME);
}

export async function putImage(
  data: ArrayBuffer,
  contentType: string,
  ext: string,
): Promise<string> {
  const key = `${crypto.randomUUID()}.${ext}`;
  await mediaStore().set(key, data, { metadata: { contentType } });
  return key;
}
