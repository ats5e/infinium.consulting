import type { MetadataRoute } from "next";
import { ALL_PATHS } from "@/components/wireframe/Pages";

const SITE = "https://infinium-technology.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_PATHS.map((path) => ({
    url: path === "" ? SITE : `${SITE}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
