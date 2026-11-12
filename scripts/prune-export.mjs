#!/usr/bin/env node
/*
 * Prune unreferenced media from a static export before upload.
 *
 * public/ keeps every image variant the pipeline has ever produced (older
 * versions are retained on purpose — see design/assets.json), so the export
 * ships ~36 MB of files no page references. This removes them from the
 * EXPORT only; nothing in the repo is touched.
 *
 *   node scripts/prune-export.mjs            # dry run: lists what would go
 *   node scripts/prune-export.mjs --delete   # actually delete
 *   node scripts/prune-export.mjs --dir out  # export folder (default: out)
 *
 * A file is kept when its URL appears in any exported .html, .txt (RSC
 * payload), .css, .js, .json or .xml file. Every page is pre-rendered, so
 * each image a visitor can load is named in that output. Only the media
 * folders below are considered; _next/ and everything else is left alone.
 */
import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const doDelete = args.includes("--delete");
const dirFlag = args.indexOf("--dir");
const OUT = path.resolve(dirFlag >= 0 ? args[dirFlag + 1] : "out");
const MEDIA_DIRS = ["img", "awards", "partners", "logos other", "New Photos & Videos"];
const TEXT_EXT = new Set([".html", ".txt", ".css", ".js", ".json", ".xml"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

try {
  await stat(OUT);
} catch {
  console.error(`No export folder at ${OUT}. Build the export first, or pass --dir.`);
  process.exit(1);
}

const all = await walk(OUT);
let haystack = "";
for (const file of all) {
  if (TEXT_EXT.has(path.extname(file))) haystack += (await readFile(file, "utf8")) + "\n";
}
// references may be raw, URI-encoded, or JSON-escaped
const decoded = haystack.replace(/\\\//g, "/");

const candidates = all.filter((file) => {
  const rel = path.relative(OUT, file).split(path.sep);
  return MEDIA_DIRS.includes(rel[0]) && !TEXT_EXT.has(path.extname(file));
});

let bytes = 0;
const unused = [];
for (const file of candidates) {
  const url = "/" + path.relative(OUT, file).split(path.sep).join("/");
  const encoded = url.split("/").map(encodeURIComponent).join("/");
  if (decoded.includes(url) || decoded.includes(encoded)) continue;
  unused.push(file);
  bytes += (await stat(file)).size;
}

for (const file of unused) {
  if (doDelete) await rm(file);
}
const mb = (bytes / 1024 / 1024).toFixed(1);
console.log(
  `${doDelete ? "Deleted" : "Would delete"} ${unused.length} of ${candidates.length} media files (${mb} MB) from ${OUT}.` +
    (doDelete ? "" : " Re-run with --delete to apply."),
);
if (!doDelete) for (const file of unused.slice(0, 15)) console.log("  " + path.relative(OUT, file));
