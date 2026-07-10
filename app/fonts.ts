import localFont from "next/font/local";

/*
 * Self-hosted, latin-subset woff2 (built with fontTools — see README).
 * Display: General Sans — neo-grotesque register per the Palantir
 * reference (client-directed swap from Outfit, 2026-07-10).
 * Quicksand carries ONLY the QBricks wordmark glyphs (2.5KB subset) —
 * QBricks' own brand face, extracted from qbricks.vercel.app.
 */

export const generalSans = localFont({
  src: "./fonts/generalsans-var.woff2",
  weight: "200 700",
  variable: "--font-general-sans",
  display: "swap",
});

export const inter = localFont({
  src: "./fonts/inter-var.woff2",
  weight: "400 600",
  variable: "--font-inter",
  display: "swap",
});

export const plexMono = localFont({
  src: [
    { path: "./fonts/plexmono-400.woff2", weight: "400" },
    { path: "./fonts/plexmono-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const quicksandBrand = localFont({
  src: "./fonts/quicksand-brand.woff2",
  weight: "300 700",
  variable: "--font-quicksand-brand",
  display: "swap",
  preload: false,
});
