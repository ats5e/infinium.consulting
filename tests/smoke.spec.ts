import { test, expect } from "@playwright/test";

const ROUTES: Array<[path: string, h1: RegExp]> = [
  ["/", /Months,\s*not years/i],
  ["/about", /business outcomes/i],
  ["/services", /Our services/i],
  ["/solutions", /Our solutions/i],
  ["/solutions/qbricks", /No more data pipelines/i],
  ["/solutions/vbricks", /major change in model testing/i],
  ["/solutions/ai-factory", /From AI pilots to an industrial AI capability/i],
  ["/solutions/esg-reporting", /Audit-ready ESG disclosure/i],
  ["/solutions/ai-assessment", /AI assessment/i],
  ["/technologies", /Technologies/i],
  ["/insights", /Case studies/i],
  ["/perspectives", /seeing in the market/i],
  ["/about/infinium-labs", /Products built by people/i],
  ["/careers", /Your career/i],
  ["/contact", /speak to an expert/i],
  ["/privacy", /privacy notice/i],
  ["/terms", /terms of use/i],
  ["/cookies", /cookie policy/i],
  ["/accessibility", /accessibility statement/i],
  // unlisted, noindexed — reachable only by direct URL, but held to the same bar
  ["/one4one", /Your first professional role/i],
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
  // the takeover menu is the primary navigation on every viewport.
  // QBricks/VBricks are intentionally NOT top-level here — they live under
  // Solutions and remain reachable via search — so they're not asserted.
  await page.getByRole("button", { name: /open menu/i }).click();
  for (const label of ["Services", "Solutions", "Sectors", "Technologies", "Case studies", "About", "Careers", "Contact"]) {
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

test("the hero offers the two journeys", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /explore our work/i })).toHaveAttribute("href", "/services");
  await expect(page.getByRole("link", { name: /meet us/i })).toHaveAttribute("href", "/contact");
  // every journey stays reachable through the menu
  await page.getByRole("button", { name: /open menu/i }).click();
  await expect(page.getByRole("link", { name: "Services", exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact", exact: true }).first()).toBeVisible();
});

test("desktop hero keeps a compact graphic footprint", async ({ page }) => {
  await page.goto("/");
  const viewport = page.viewportSize();
  if (!viewport || viewport.width < 768) return;

  const hero = page.getByTestId("home-hero");
  const graphic = page.getByTestId("hero-graphic");
  const [heroBox, graphicBox] = await Promise.all([hero.boundingBox(), graphic.boundingBox()]);

  expect(heroBox).not.toBeNull();
  expect(graphicBox).not.toBeNull();
  expect(heroBox!.height).toBeLessThan(viewport.height * 0.9);
  expect(graphicBox!.height).toBeLessThanOrEqual(heroBox!.height * 1.02);
  expect(Math.abs(graphicBox!.y + graphicBox!.height - (heroBox!.y + heroBox!.height))).toBeLessThanOrEqual(heroBox!.height * 0.1);
});

test("hero headline, body and actions share one left edge", async ({ page }) => {
  await page.goto("/");
  const leftEdges = await page.locator(".hero-line, .hero-body, .hero-actions").evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().left),
  );
  expect(leftEdges.length).toBeGreaterThanOrEqual(4);
  expect(Math.max(...leftEdges) - Math.min(...leftEdges)).toBeLessThanOrEqual(1);
});

test("VBricks is marked as coming soon", async ({ page }) => {
  await page.goto("/solutions");
  await expect(page.getByLabel("VBricks site coming soon")).toHaveText(/coming soon/i);
  await expect(page.locator('a[href*="vbricks.vercel.app"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: /request a demo/i }).nth(1)).toHaveAttribute("href", "/contact");
});

test("product pages expose their correct brand journeys", async ({ page }) => {
  await page.goto("/solutions/qbricks");
  // the wordmark is set in the brand face, not a bitmap
  await expect(page.getByTestId("product-wordmark")).toHaveText("QBricks");
  const qbricksSite = page.getByRole("link", { name: /visit the QBricks website/i });
  await expect(qbricksSite).toHaveAttribute("href", "https://qbricks.ai");
  await expect(qbricksSite).toHaveAttribute("target", "_blank");

  await page.goto("/solutions/vbricks");
  await expect(page.getByTestId("product-wordmark")).toHaveText("VBricks");
  await expect(page.getByLabel("VBricks site coming soon").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /request a VBricks demo/i })).toHaveAttribute("href", "/contact");
});

test("technology cards use the supplied partner logos", async ({ page }) => {
  await page.goto("/technologies");
  for (const slug of ["alteryx", "appian", "databricks", "microsoft-fabric", "quantexa"]) {
    const logo = page.getByTestId(`technology-card-logo-${slug}`).locator("img");
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute("src", /(?:\/|%2F)partners(?:\/|%2F)/i);
  }
});

test("Quantexa branding is carried through its solution and technology pages", async ({ page }) => {
  for (const path of [
    "/solutions",
    "/solutions/quantexa-maturity-assessment",
    "/technologies/quantexa",
  ]) {
    await page.goto(path);
    const logo = page.locator('main img[src*="quantexa.png"]').first();
    await expect(logo).toBeVisible();
  }
});

test("Amsterdam office film has a branded cover and loads the supplied Mux player", async ({ page }) => {
  await page.goto("/about/amsterdam");
  const play = page.getByRole("button", { name: /play the Infinium Netherlands headquarters film/i });
  await expect(play).toBeVisible();
  await expect(page.locator('iframe[title="Infinium — Netherlands HQ"]')).toHaveCount(0);

  await play.click();
  const player = page.locator('iframe[title="Infinium — Netherlands HQ"]');
  await expect(player).toBeVisible();
  await expect(player).toHaveAttribute("src", /player\.mux\.com\/1O8URAIKZwRPiUpa74C02LIjg6AdMMykemKv014YT4Tf4/);
});

test("Dubai office film has a branded cover and loads the supplied YouTube player", async ({ page }) => {
  await page.goto("/about/dubai");
  const play = page.getByRole("button", { name: /play the Infinium Dubai headquarters film/i });
  await expect(play).toBeVisible();
  await expect(page.getByText("DIFC: a world-leading FinTech hub")).toBeVisible();
  await expect(page.locator('iframe[title="Infinium — Dubai HQ"]')).toHaveCount(0);
  const coverBox = await play.boundingBox();
  expect(coverBox).not.toBeNull();
  expect(coverBox!.width).toBeLessThanOrEqual(896);
  expect(coverBox!.height).toBeLessThanOrEqual(coverBox!.width * 0.6);

  await play.click();
  const player = page.locator('iframe[title="Infinium — Dubai HQ"]');
  await expect(player).toBeVisible();
  await expect(player).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/kGEchctLQGQ/);
});

test("case-study artwork uses the editorial media frame", async ({ page }) => {
  await page.goto("/insights/regulatory-reporting");
  const visual = page.getByTestId("case-study-visual");
  await expect(visual).toBeVisible();
  await expect(visual.getByRole("img")).toHaveAttribute(
    "alt",
    /project illustration/i,
  );

  const width = await visual.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  const viewportWidth = page.viewportSize()?.width ?? width;
  expect(width).toBeLessThanOrEqual(Math.min(1000, viewportWidth));
});

test("every case study has unique artwork", async ({ page }) => {
  await page.goto("/insights");
  const cards = page.getByTestId("case-study-card");
  await expect(cards).toHaveCount(9);

  const sources = await cards.locator("img").evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute("src")),
  );

  expect(new Set(sources).size).toBe(sources.length);
});

test("trademark lockup keeps the crystal behind the wordmark", async ({ page }) => {
  await page.goto("/");
  const lockup = page.locator('[data-lockup="animated"]');
  await expect(lockup).toHaveCount(1);
  const geometry = await lockup.evaluate((element) => {
    const crystal = element.querySelector<HTMLElement>('[data-logo-layer="crystal"]');
    const wordmark = element.querySelector<HTMLElement>('[data-logo-layer="wordmark"]');
    if (!crystal || !wordmark) return null;
    const c = crystal.getBoundingClientRect();
    const w = wordmark.getBoundingClientRect();
    return {
      overlap: Math.min(c.right, w.right) - Math.max(c.left, w.left),
      crystalZ: Number.parseInt(getComputedStyle(crystal).zIndex || "0", 10),
      wordmarkZ: Number.parseInt(getComputedStyle(wordmark).zIndex || "0", 10),
    };
  });
  expect(geometry).not.toBeNull();
  expect(geometry!.overlap).toBeGreaterThan(20);
  expect(geometry!.crystalZ).toBeLessThan(geometry!.wordmarkZ);
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
  // the legal row: privacy split from cookies, plus terms and accessibility
  await expect(page.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/privacy");
  await expect(page.getByRole("link", { name: "Cookies", exact: true })).toHaveAttribute("href", "/cookies");
  await expect(page.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute("href", "/terms");
  await expect(page.getByRole("link", { name: "Accessibility", exact: true })).toHaveAttribute("href", "/accessibility");
  await expect(page.getByRole("link", { name: /linkedin/i })).toHaveAttribute("href", /linkedin\.com\/company\/infinium-consulting/);
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
