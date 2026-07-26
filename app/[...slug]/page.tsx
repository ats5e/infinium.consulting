import type { Metadata } from "next";
import { ALL_PATHS, routeFor } from "@/components/wireframe/Pages";

type Params = { slug: string[] };

const DEDICATED = new Set(["", "contact", "about", "services", "careers", "privacy"]);

export function generateStaticParams(): Params[] {
  return ALL_PATHS
    .filter((path) => !DEDICATED.has(path))
    .map((path) => ({ slug: path.split("/") }));
}

// Next 16: params is a Promise — synchronous property access silently
// yields undefined, which made every catch-all route render the home page.
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = routeFor(slug ?? []);
  const path = `/${(slug ?? []).join("/")}`;
  return {
    title: route.meta.title,
    description: route.meta.description,
    alternates: { canonical: path },
    // per-route og:url, so shares resolve to the page rather than the root
    openGraph: { url: path, title: route.meta.title, description: route.meta.description },
  };
}

export default async function WireframeRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  return routeFor(slug ?? []).render();
}
