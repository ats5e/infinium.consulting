/**
 * Krea originals (design/raw, gitignored) → optimised derivatives
 * (public/img, committed) + LQIP manifest + contact sheet.
 *
 * Usage: node scripts/process-images.mjs
 * Input naming: design/raw/<slot>-v<n>.<ext>
 * Output: public/img/<slot>-v<n>.{avif,webp} at full + half width,
 *         public/img/manifest.json { slot: { variants: [{src, w, h, lqip}] } },
 *         public/contact-sheet/index.html for review.
 *
 * The manifest is MERGED with the existing one, not rebuilt from scratch:
 * a few case-study slots have an SVG v1 source that sharp cannot process
 * (it only reads png/jpg/webp), so their variants were rasterised once by
 * a separate step and only ever lived in the committed manifest. A naive
 * from-scratch rebuild silently dropped those entries, which shifted the
 * surviving v2 to index 0 while lib/images.ts CHOSEN still asked for v2 at
 * index 1 — the build then hard-failed prerendering the case-study pages.
 * Merging preserves any variant whose derivative files still exist on disk.
 */
import { readdir, mkdir, writeFile, readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAW = "design/raw";
const OUT = "public/img";
const SHEET_DIR = "public/contact-sheet";

await mkdir(OUT, { recursive: true });
await mkdir(SHEET_DIR, { recursive: true });

const files = (await readdir(RAW)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
if (files.length === 0) {
  console.error("no raw images in design/raw");
  process.exit(1);
}

const exists = (p) => access(p).then(() => true, () => false);

/* Seed from the existing manifest so variants this run cannot regenerate
 * (e.g. SVG-sourced ones) survive — but only if their served files are
 * still on disk, so a genuinely deleted variant is still pruned. */
const manifest = {};
let priorManifest = {};
try {
  priorManifest = JSON.parse(await readFile(path.join(OUT, "manifest.json"), "utf8"));
} catch {
  /* first run, or no manifest yet — start empty */
}
for (const [slot, entry] of Object.entries(priorManifest)) {
  const kept = [];
  for (const v of entry.variants ?? []) {
    if (await exists(path.join(OUT, `${path.basename(v.src)}.webp`))) kept.push(v);
    else console.warn(`dropping ${v.src} — no derivative file on disk`);
  }
  if (kept.length) manifest[slot] = { variants: kept };
}

for (const file of files.sort()) {
  const name = file.replace(/\.[^.]+$/, "");
  const m = name.match(/^(.+)-v(\d+)$/);
  if (!m) {
    console.warn(`skipping ${file} — expected <slot>-v<n>.<ext>`);
    continue;
  }
  const [, slot] = m;
  const src = sharp(path.join(RAW, file));
  const meta = await src.metadata();

  const fullWidth = Math.min(meta.width, 3200); // enhanced masters exceed display needs
  // -mob (800w) keeps LCP images affordable on throttled mobile connections
  for (const [suffix, width] of [["", fullWidth], ["-half", Math.round(fullWidth / 2)], ["-mob", 800]]) {
    // gentle sharpen on downscale keeps the glass edges crisp; higher
    // quality floors avoid banding/grain-smear on the dark gradients
    const base = src.clone().resize({ width }).sharpen({ sigma: 0.8, m1: 0.6, m2: 2 }).withMetadata({});
    await base.clone().avif({ quality: 68, effort: 6 }).toFile(path.join(OUT, `${name}${suffix}.avif`));
    await base.clone().webp({ quality: 86 }).toFile(path.join(OUT, `${name}${suffix}.webp`));
  }

  const lqipBuf = await src.clone().resize({ width: 20 }).webp({ quality: 30 }).toBuffer();
  const entry = {
    src: `/img/${name}`,
    w: meta.width,
    h: meta.height,
    lqip: `data:image/webp;base64,${lqipBuf.toString("base64")}`,
  };
  const variants = (manifest[slot] ??= { variants: [] }).variants;
  // replace a same-src variant carried over from the prior manifest, else append
  const at = variants.findIndex((v) => v.src === entry.src);
  if (at >= 0) variants[at] = entry;
  else variants.push(entry);
  console.log(`${name}: ${meta.width}x${meta.height} → avif/webp + lqip`);
}

// keep each slot's variants in v-number order so array index ↔ v<n> stays stable
for (const entry of Object.values(manifest)) {
  entry.variants.sort((a, b) => a.src.localeCompare(b.src, undefined, { numeric: true }));
}

await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

const rows = Object.entries(manifest)
  .map(
    ([slot, { variants }]) => `
  <section>
    <h2>${slot}</h2>
    <div class="row">
      ${variants
        .map(
          (v, i) =>
            `<figure><img src="${v.src}-half.webp" loading="lazy" alt=""><figcaption>v${i + 1} · ${v.w}×${v.h}</figcaption></figure>`
        )
        .join("\n      ")}
    </div>
  </section>`
  )
  .join("\n");

await writeFile(
  path.join(SHEET_DIR, "index.html"),
  `<!doctype html>
<meta charset="utf-8">
<title>Infinium — asset contact sheet</title>
<style>
  body { background: #05070C; color: #93A9BF; font: 12px/1.6 ui-monospace, monospace; padding: 40px; margin: 0; }
  h2 { color: #fff; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; font-size: 12px; border-top: 1px solid rgba(154,199,248,.12); padding-top: 16px; }
  .row { display: flex; gap: 12px; }
  figure { margin: 0; flex: 1; min-width: 0; }
  img { width: 100%; height: auto; display: block; }
  figcaption { padding: 6px 0 20px; letter-spacing: .14em; text-transform: uppercase; }
</style>
<h1 style="color:#fff;font-weight:500">Contact sheet</h1>
${rows}
`
);

console.log(`\nmanifest + contact sheet written (${Object.keys(manifest).length} slots)`);
