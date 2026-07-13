import type { MetadataRoute } from "next";

const SITE = "https://infinium-technology.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/services",
    "/products",
    "/products/qbricks",
    "/products/tbricks",
    "/careers",
    "/contact",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
