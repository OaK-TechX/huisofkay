// Generates PWA icons from the wax-seal logo. Run: node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/brand/logo.png";
const OUT = "public/icons";
const INK = { r: 11, g: 11, b: 12, alpha: 1 }; // #0b0b0c

await mkdir(OUT, { recursive: true });

// "any" purpose: the logo already sits on its own dark circle.
await sharp(SRC).resize(192, 192, { fit: "cover" }).png().toFile(`${OUT}/icon-192.png`);
await sharp(SRC).resize(512, 512, { fit: "cover" }).png().toFile(`${OUT}/icon-512.png`);
await sharp(SRC).resize(180, 180, { fit: "cover" }).png().toFile(`${OUT}/apple-touch-icon.png`);

// maskable: seal padded to the safe zone on a solid ink canvas.
const inner = await sharp(SRC)
  .resize(410, 410, { fit: "contain", background: INK })
  .png()
  .toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: INK } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(`${OUT}/maskable-512.png`);

console.log("PWA icons generated in", OUT);
