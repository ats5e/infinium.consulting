import manifest from "@/public/img/manifest.json";

/* Chosen variants — decisions logged in design/assets.json. */
const CHOSEN: Record<string, number> = {
  hero: 1,
  "data-engineering": 4,
  "data-science": 4,
  "digital-transformation": 4,
  governance: 4,
  qbricks: 4,
  tbricks: 4,
  "about-difc": 4,
  careers: 4, // real team photography replaces the v3 render
  // About Us photography (real): decisions logged in design/assets.json
  "team-together": 1,
  "ams-exterior": 1,
  "ams-stairs": 1,
  "ams-hall": 1,
  "culture-cruise": 1,
  "culture-gala": 1,
  "culture-ski": 1,
  "culture-win": 1,
  "culture-canal": 1,
  "culture-summer": 1,
  "one4one-cohort": 1,
  "events-nextwave": 1,
  // wireframe-supplied assets (single variant each)
  "cs-reg-reporting": 1,
  "cs-capital-requirements": 1,
  "cs-climate-reporting": 1,
  "cs-entity-standup": 1,
  "cs-data-strategy": 1,
  "cs-big-data": 1,
  "cs-finance-reeng": 1,
  "cs-fintech-dx": 1,
  "cs-tbml-detection": 1,
  "ams-office": 1,
  "ams-building": 1,
  "ams-workspace": 1,
  "ams-atrium": 1,
  "dxb-innovationone": 1,
  "dxb-workspace": 1,
  "dxb-ai-campus": 1,
  "dxb-entrance": 1,
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
