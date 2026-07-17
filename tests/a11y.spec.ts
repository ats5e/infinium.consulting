import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// reveal transitions animate opacity; axe must scan the settled page,
// not a frame mid-fade — reduced motion renders final state immediately
test.use({ contextOptions: { reducedMotion: "reduce" } });

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/solutions",
  "/solutions/qbricks",
  "/solutions/vbricks",
  "/solutions/ai-assessment",
  "/services/data-and-ai",
  "/technologies",
  "/technologies/quantexa",
  "/insights",
  "/insights/regulatory-reporting",
  "/about/amsterdam",
  "/careers",
  "/contact",
  "/privacy",
];

for (const path of ROUTES) {
  test(`${path} passes axe`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Settle every scroll-reveal to its final, fully-opaque state before
    // scanning. Elements caught mid-fade report false contrast failures;
    // this makes the audit deterministic regardless of animation timing.
    await page.evaluate(() =>
      document
        .querySelectorAll("[data-armed]")
        .forEach((el) => el.removeAttribute("data-armed"))
    );
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length}× — ${v.help}`),
      `axe violations on ${path}`
    ).toEqual([]);
  });
}
