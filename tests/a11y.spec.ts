import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// reveal transitions animate opacity; axe must scan the settled page,
// not a frame mid-fade — reduced motion renders final state immediately
test.use({ reducedMotion: "reduce" });

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/products",
  "/products/qbricks",
  "/products/tbricks",
  "/careers",
  "/contact",
];

for (const path of ROUTES) {
  test(`${path} passes axe`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length}× — ${v.help}`),
      `axe violations on ${path}`
    ).toEqual([]);
  });
}
