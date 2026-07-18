/**
 * Duotone treatment for team headshots: --color-void → --color-ice, so
 * the photographs sit inside the optical-glass visual system.
 * Also cuts the OG card (1200×630) from the enhanced hero master.
 */
import sharp from "sharp";

const VOID_ = { r: 5, g: 7, b: 12 };
const ICE = { r: 154, g: 199, b: 248 };

async function duotone(src, out, crop) {
  // optional face-framed crop so every portrait carries the same
  // head-and-shoulders composition regardless of the source shot
  let base0 = sharp(src);
  if (crop) base0 = base0.extract(crop);
  const img = base0.resize(800, 800, { fit: "cover" }).grayscale();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const rgb = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 3) {
    const t = data[i] / 255;
    rgb[j] = Math.round(VOID_.r + (ICE.r - VOID_.r) * t);
    rgb[j + 1] = Math.round(VOID_.g + (ICE.g - VOID_.g) * t);
    rgb[j + 2] = Math.round(VOID_.b + (ICE.b - VOID_.b) * t);
  }
  const base = sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } });
  await base.clone().webp({ quality: 82 }).toFile(`${out}.webp`);
  await base.clone().avif({ quality: 60 }).toFile(`${out}.avif`);
  console.log(`${out}: duotone 800x800`);
}

// david's source is a wide stage shot — crop to head-and-shoulders
await duotone("design/team/david-aston.jpg", "public/img/team-david", {
  left: 70,
  top: 15,
  width: 470,
  height: 470,
});
// benjamin's source is a full-length environmental shot — crop to the
// same head-and-shoulders framing as david's
await duotone("design/team/benjamin-aston.png", "public/img/team-benjamin", {
  left: 155,
  top: 110,
  width: 430,
  height: 430,
});

// OG card: 1200x630 from the enhanced hero — object left, negative space
// right for the lockup composited by the OG image route.
const meta = await sharp("design/raw/hero-v1.png").metadata();
const winH = meta.height; // 5376
const winW = Math.round((winH * 1200) / 630); // 10240
const objectCx = Math.round(meta.width * 0.52);
const left = Math.max(0, Math.min(meta.width - winW, objectCx - Math.round(winW * 0.35)));
await sharp("design/raw/hero-v1.png")
  .extract({ left, top: 0, width: winW, height: winH })
  .resize(1200, 630)
  .png()
  .toFile("public/img/og-base.png");
console.log(`og-base: 1200x630 (crop left=${left})`);
