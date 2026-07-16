import localFont from "next/font/local";

/*
 * Self-hosted, latin-subset woff2 (built with fontTools — see README).
 * One engineered family carries the whole site: one face, Geist, for everything
 * (client-directed: no monospace anywhere on the site) (client-directed direction
 * change from General Sans/Inter/Plex Mono, 2026-07-10).
 * Quicksand carries ONLY the QBricks wordmark glyphs (2.5KB subset) —
 * QBricks' own brand face, extracted from qbricks.vercel.app.
 */

export const geist = localFont({
  src: "./fonts/geist-var.woff2",
  weight: "100 900",
  variable: "--font-geist",
  display: "swap",
});

/* the logo's own letterforms — geometric, monoline, round-dotted.
 * Outfit won the 200px "fin" comparison against the wordmark
 * (design/PLAN.md §3); it carries ONLY the hero headline. */
export const outfit = localFont({
  src: "./fonts/outfit-var.woff2",
  weight: "100 900",
  variable: "--font-outfit",
  display: "swap",
});

export const quicksandBrand = localFont({
  src: "./fonts/quicksand-brand.woff2",
  weight: "300 700",
  variable: "--font-quicksand-brand",
  display: "swap",
  preload: false,
});
