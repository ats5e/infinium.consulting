/**
 * Extract dominant colour clusters from the Infinium logo.
 * Usage: node scripts/extract-palette.mjs [k]
 * Near-white background pixels are reported separately, not clustered —
 * the brand blues live in the cube facets.
 */
import sharp from "sharp";

const SRC = "design/Infinium-Technology-Introducing-Our-Business-2.png";
const K = Number(process.argv[2] ?? 8);

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = [];
let white = 0;
let transparent = 0;
let total = 0;
for (let i = 0; i < data.length; i += 4) {
  const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
  total++;
  if (a < 128) {
    transparent++;
    continue;
  }
  if (r > 240 && g > 240 && b > 240) {
    white++;
    continue;
  }
  px.push([r, g, b]);
}

// k-means++ seeding, then Lloyd iterations
const dist2 = (a, b) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

const centroids = [px[Math.floor(Math.random() * px.length)]];
while (centroids.length < K) {
  const d = px.map((p) => Math.min(...centroids.map((c) => dist2(p, c))));
  const sum = d.reduce((a, b) => a + b, 0);
  let r = Math.random() * sum;
  let idx = 0;
  while ((r -= d[idx]) > 0) idx++;
  centroids.push(px[idx]);
}

let assign = new Array(px.length).fill(0);
for (let iter = 0; iter < 24; iter++) {
  let moved = false;
  for (let i = 0; i < px.length; i++) {
    let best = 0;
    let bd = Infinity;
    for (let c = 0; c < K; c++) {
      const d = dist2(px[i], centroids[c]);
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    if (assign[i] !== best) {
      assign[i] = best;
      moved = true;
    }
  }
  const sums = Array.from({ length: K }, () => [0, 0, 0, 0]);
  for (let i = 0; i < px.length; i++) {
    const s = sums[assign[i]];
    s[0] += px[i][0];
    s[1] += px[i][1];
    s[2] += px[i][2];
    s[3]++;
  }
  for (let c = 0; c < K; c++) {
    if (sums[c][3] > 0)
      centroids[c] = [
        sums[c][0] / sums[c][3],
        sums[c][1] / sums[c][3],
        sums[c][2] / sums[c][3],
      ];
  }
  if (!moved) break;
}

const counts = new Array(K).fill(0);
for (const a of assign) counts[a]++;

const hex = (c) =>
  "#" +
  c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

const lum = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

const clusters = centroids
  .map((c, i) => ({ hex: hex(c), rgb: c.map(Math.round), share: counts[i] / px.length, lum: lum(c) }))
  .filter((c) => c.share > 0.005)
  .sort((a, b) => a.lum - b.lum);

console.log(`source: ${SRC} (${info.width}x${info.height})`);
console.log(`transparent: ${((transparent / total) * 100).toFixed(1)}%, near-white wordmark/highlight: ${((white / total) * 100).toFixed(1)}% (both excluded)\n`);
console.log("clusters, darkest → lightest (share of non-white pixels):");
for (const c of clusters)
  console.log(
    `  ${c.hex}  rgb(${c.rgb.join(",")})  ${(c.share * 100).toFixed(1)}%`
  );
