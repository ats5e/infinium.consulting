import manifest from "@/public/img/manifest.json";

/* Chosen variants — decisions logged in design/assets.json. */
const CHOSEN: Record<string, number> = {
  hero: 1,
  "data-engineering": 4,
  "data-science": 4,
  "digital-transformation": 4,
  governance: 5,
  qbricks: 5,
  tbricks: 5,
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
  // case-study artwork: v2 is the Krea glass-render set, replacing the flat
  // vector diagrams that read as generic stock data-viz (v1 retained)
  "cs-reg-reporting": 2,
  "cs-capital-requirements": 2,
  "cs-climate-reporting": 2,
  "cs-entity-standup": 2,
  "cs-data-strategy": 2,
  "cs-big-data": 2,
  "cs-finance-reeng": 2,
  "cs-fintech-dx": 2,
  "cs-tbml-detection": 2,
  "ams-office": 1,
  "ams-building": 1,
  "ams-workspace": 1,
  "ams-atrium": 1,
  "dxb-innovationone": 1,
  "dxb-workspace": 1,
  "dxb-ai-campus": 1,
  "dxb-entrance": 1,
  // originals were too small to ship; Topaz-upscaled from the client shoot
  "dxb-difc-gate": 1,
  "dxb-innovation-hub": 1,
  "culture-toast": 1,
  "culture-harbour": 1,
  // v2 (2026-08-19): recent Amsterdam-hub team shot replaces the dated,
  // low-res (400px) end-of-year event photo — client checklist item 5
  "culture-yearend": 2,
  // client-supplied Power BI screenshot of the live assessment tool
  // (David Aston, 31 Jul 2026 — "A screenshot for the Quantexa assessment page")
  "quantexa-dashboard": 1,
  // v2 (2026-08-20): Krea glass render for the services card — the team
  // photo (careers slot) broke the cobalt-render set on the services index
  "sustainable-finance": 2,
  // v1 (2026-08-20): Krea glass render replacing the about-difc architecture
  // shot on the Strategy and Change services card (client alignment feedback)
  "strategy-change": 1,
  // second client drop — culture, industry events, Dubai, academic partners
  "culture-terrace": 1,
  "culture-night": 1,
  "culture-lounge": 1,
  "culture-offsite": 1,
  "culture-standup": 1,
  "culture-onthe-road": 1,
  "event-panel": 1,
  "event-nordic": 1,
  "event-roundtable": 1,
  "event-alteryx": 1,
  "dxb-lobby": 1,
  "dxb-innovation-wall": 1,
  "dxb-lounge": 1,
  "partners-aspiro": 1,
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
  /* Fail with the slot name rather than a bare "cannot read properties of
   * undefined" — a missing manifest entry has broken the build before. */
  if (!entry) {
    throw new Error(
      `siteImage("${slot}"): no entry in public/img/manifest.json. Add the source to design/raw and run scripts/process-images.mjs.`,
    );
  }
  const v = entry.variants[CHOSEN[slot] - 1];
  if (!v) {
    throw new Error(
      `siteImage("${slot}"): variant v${CHOSEN[slot]} is missing (manifest has ${entry.variants.length}). Check CHOSEN in lib/images.ts.`,
    );
  }
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
