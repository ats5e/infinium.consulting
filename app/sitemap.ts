import type { MetadataRoute } from "next";
import { ALL_PATHS } from "@/components/wireframe/Pages";

const SITE = "https://infinium-technology.com";

/* Stamped at build time from the commit date when available, so redeploying
 * unchanged content does not tell crawlers every page just changed.
 * Google ignores <priority>, so it is not emitted. */
const LAST_MODIFIED = new Date(
  process.env.VERCEL_GIT_COMMIT_SHA ? (process.env.SITE_BUILD_DATE ?? Date.now()) : Date.now(),
);

export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_PATHS.map((path) => ({
    url: path === "" ? SITE : `${SITE}/${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
  }));
}
