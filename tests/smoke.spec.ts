import { test, expect } from "@playwright/test";

const ROUTES: Array<[path: string, h1: RegExp]> = [
  ["/", /Data engineering/i],
  ["/about", /practitioners/i],
  ["/services", /focus areas/i],
  ["/products", /production/i],
  ["/products/qbricks", /no more data pipelines/i],
  ["/products/tbricks", /prove the model/i],
  ["/careers", /practitioners/i],
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

test("nav reaches every route", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /open menu/i }).click();
  for (const label of ["About", "Services", "Products", "Careers", "Contact"]) {
    await expect(page.getByRole("link", { name: label, exact: true }).first()).toBeVisible();
  }
});

test("contact form validates and reports errors accessibly", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("A");
  await page.getByLabel("Work email").fill("not-an-email");
  await page.getByLabel(/what are you trying to solve/i).fill("short");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/doesn’t look right/i)).toBeVisible();
});

test("footer carries the corrected contact details", async ({ page }) => {
  await page.goto("/");
  const mail = page.locator('a[href="mailto:sales@infinium.technology"]').first();
  await expect(mail).toBeAttached();
  // the live-site defect: display text and mailto disagreeing
  await expect(page.locator('a[href*="office@yourwebsite.com"]')).toHaveCount(0);
  await expect(page.locator('a[href*="tel:"]')).toHaveCount(0);
});
