import type { Metadata } from "next";
import { ServicesWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services.",
  alternates: { canonical: "/services" },
  // per-page og:url (the layout's "/" was being inherited); setting openGraph
  // replaces the inherited object, so the share card is re-attached
  openGraph: { url: "/services", siteName: "Infinium", type: "website", locale: "en_GB", images: ["/opengraph-image"] },
};

export default function Services() {
  return <ServicesWirePage />;
}
