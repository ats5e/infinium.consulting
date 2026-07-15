import { test, expect } from "@playwright/test";

const ROUTES: Array<[path: string, h1: RegExp]> = [
  ["/", /Engineering with context/i],
  ["/about", /business outcomes/i],
  ["/services", /Our services/i],
  ["/solutions", /Our solutions/i],
  ["/solutions/ai-assessment", /AI assessment/i],
  ["/technologies", /Technologies/i],
  ["/insights", /Case studies/i],
  ["/careers", /Your career/i],
  ["/contact", /start a conversation/i],
];

for (const [path, h1] of ROUTES) {
  test(`${path} renders`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);

    // exactly one h1, matching the page's subject
    const h1s = page.locator("h1");
    await expect(h1s).toHaveCount(1);
    await expect(h1s.first()).toContainText(h1);

    // the title template is applied — never the WordPress ghost
    await expect(page).toHaveTitle(/Infinium Technology/);
    await expect(page).not.toHaveTitle(/My WordPress/);

    // no console errors during load
    await page.waitForLoadState("networkidle");
    expect(errors, `console errors on ${path}`).toEqual([]);
  });
}

test("nav reaches every route", async ({ page }) => {
  await page.goto("/");
  // the takeover menu is the primary navigation on every viewport
  await page.getByRole("button", { name: /open menu/i }).click();
  for (const label of ["QBricks", "VBricks", "Services", "Sectors", "Technologies", "Case studies", "About", "Careers", "Contact"]) {
    await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  }
  // home stays reachable through the wordmark
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test("hero Learn more scrolls past the hero", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Learn more" }).click();
  // Lenis eases over ~1.2s; give it room, then confirm real movement
  await page.waitForTimeout(2000);
  const y = await page.evaluate(() => window.scrollY);
  expect(y).toBeGreaterThan(300);
});

test("contact form validates and reports errors accessibly", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A");
  await page.getByLabel("Work email").fill("not-an-email");
  await page.getByLabel(/message/i).fill("short");
  await page.getByRole("button", { name: /start a conversation/i }).click();
  await expect(page.getByText(/doesn’t look right/i)).toBeVisible();
});

test("footer carries the wireframe structure", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Engineering with context/i).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Our solutions" }).last()).toBeVisible();
  await expect(page.locator('a[href*="office@yourwebsite.com"]')).toHaveCount(0);
  await expect(page.locator('a[href*="tel:"]')).toHaveCount(0);
});
