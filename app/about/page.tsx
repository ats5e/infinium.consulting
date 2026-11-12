import type { Metadata } from "next";
import { AboutWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "About us",
  description: "It's all about business outcomes.",
  alternates: { canonical: "/about" },
  // per-page og:url (the layout's "/" was being inherited); setting openGraph
  // replaces the inherited object, so the share card is re-attached
  openGraph: { url: "/about", siteName: "Infinium", type: "website", locale: "en_GB", images: ["/opengraph-image"] },
};

export default function About() {
  return <AboutWirePage />;
}
