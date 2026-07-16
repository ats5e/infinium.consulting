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
  ["/privacy", /privacy notice/i],
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
  for (const label of ["QBricks", "VBricks", "Services", "Solutions", "Sectors", "Technologies", "Insights", "About", "Careers", "Contact"]) {
    await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  }
  // home stays reachable through the wordmark
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test("navigation overlay isolates page content and restores focus", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /open menu/i });
  await button.click();
  await expect(page.getByRole("dialog", { name: "Site navigation" })).toBeVisible();
  await expect(page.locator("#main")).toHaveAttribute("inert", "");
  await expect(page.locator("#site-footer")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(page.locator("#main")).not.toHaveAttribute("inert", "");
});

test("home hero exposes the wireframe journeys", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Let’s meet", exact: true })).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("link", { name: "Our services", exact: true }).first()).toHaveAttribute("href", "/services");
  await expect(page.getByRole("link", { name: "Our solutions", exact: true }).first()).toHaveAttribute("href", "/solutions");
});

test("contact form validates and reports errors accessibly", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A");
  await page.getByLabel("Work email").fill("not-an-email");
  await page.getByLabel(/message/i).fill("short");
  await page.getByRole("button", { name: /start a conversation/i }).click();
  const emailError = page.getByText(/doesn’t look right/i);
  await expect(emailError).toBeVisible();
  await expect(page.getByLabel("Work email")).toHaveAttribute("aria-describedby", "email-error");
});

test("footer carries the wireframe structure", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Engineering with context/i).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Our solutions" }).last()).toBeVisible();
  await expect(page.locator('a[href*="office@yourwebsite.com"]')).toHaveCount(0);
  await expect(page.locator('a[href*="tel:"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /privacy & cookies/i })).toHaveAttribute("href", "/privacy");
});

test("every sitemap route renders one page without horizontal overflow", async ({ page }) => {
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)?<\/loc>/g)].map((m) => m[1] || "/");
  expect(paths.length).toBeGreaterThanOrEqual(39);

  const consoleErrors: string[] = [];
  let currentPath = "";
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${currentPath}: ${msg.text()}`);
  });

  for (const path of paths) {
    currentPath = path;
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
  }

  expect(consoleErrors).toEqual([]);
});
