import manifest from "@/public/img/manifest.json";

/* Chosen variants — decisions logged in design/assets.json. */
const CHOSEN: Record<string, number> = {
  hero: 1,
  "data-engineering": 2,
  "data-science": 3,
  "digital-transformation": 1,
  governance: 3,
  qbricks: 2,
  tbricks: 3,
  "about-difc": 1,
  careers: 3,
};

export type SiteImage = {
  avif: string;
  webp: string;
  avifHalf: string;
  webpHalf: string;
  avifMob: string;
  webpMob: string;
  width: number;
  height: number;
  lqip: string;
};

export function siteImage(slot: keyof typeof CHOSEN): SiteImage {
  const entry = manifest[slot as keyof typeof manifest];
  const v = entry.variants[CHOSEN[slot] - 1];
  // derivatives are capped at 3200px wide; manifest records source dims —
  // normalise so width/height attributes match the served file
  const width = Math.min(v.w, 3200);
  const height = Math.round((v.h / v.w) * width);
  return {
    avif: `${v.src}.avif`,
    webp: `${v.src}.webp`,
    avifHalf: `${v.src}-half.avif`,
    webpHalf: `${v.src}-half.webp`,
    avifMob: `${v.src}-mob.avif`,
    webpMob: `${v.src}-mob.webp`,
    width,
    height,
    lqip: v.lqip,
  };
}
