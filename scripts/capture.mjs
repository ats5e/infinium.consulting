/**
 * Phase 7 delivery captures: every route at 390/768/1440/1920, plus a
 * video of the hero → hairline compression. Run against `pnpm start`.
 * Usage: node scripts/capture.mjs [baseURL]   (default http://localhost:3100)
 */
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.argv[2] ?? "http://localhost:3100";
const OUT = "design/screens";
const ROUTES = ["/", "/about", "/services", "/products", "/products/qbricks", "/products/tbricks", "/careers", "/contact"];
const WIDTHS = [390, 768, 1440, 1920];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: Math.round(width < 768 ? 844 : (width / 16) * 9) },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  // skip the load sequence so captures show the settled page
  await page.addInitScript(() => sessionStorage.setItem("inf-load", "1"));
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    // walk the page with wheel events (Lenis listens to wheel, not
    // scrollTo) so every reveal group fires before the capture
    const height = await page.evaluate(() => document.body.scrollHeight);
    const viewport = page.viewportSize()?.height ?? 800;
    for (let y = 0; y < height; y += Math.round(viewport * 0.55)) {
      await page.mouse.wheel(0, Math.round(viewport * 0.55));
      await page.waitForTimeout(140);
    }
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, -height * 2);
    await page.waitForTimeout(900);
    const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({
      path: `${OUT}/${name}-${width}.png`,
      fullPage: true,
      animations: "disabled",
      timeout: 45_000,
    });
    console.log(`${name} @ ${width}`);
  }
  await ctx.close();
}

// hero compression capture, ~10s
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 810 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 810 } },
});
const page = await ctx.newPage();
await page.addInitScript(() => sessionStorage.setItem("inf-load", "1"));
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
// steady scroll through the 180svh hero
for (let i = 0; i <= 80; i++) {
  await page.mouse.wheel(0, 22);
  await page.waitForTimeout(90);
}
await page.waitForTimeout(1200);
await ctx.close();
await browser.close();
console.log("video in", OUT);
