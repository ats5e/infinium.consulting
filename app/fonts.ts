import localFont from "next/font/local";

/*
 * Self-hosted, latin-subset woff2 (built with fontTools — see README).
 * Outfit chosen by 200px "fin" comparison against the logo wordmark
 * (design/PLAN.md §3). Weight ceiling for display is 600.
 */

export const outfit = localFont({
  src: "./fonts/outfit-var.woff2",
  weight: "100 900",
  variable: "--font-outfit",
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
