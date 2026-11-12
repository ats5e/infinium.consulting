import type { Metadata } from "next";
import { CareersWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "Your career",
  description:
    "We are a values-led firm built from seasoned professionals and dynamic new talent.",
  alternates: { canonical: "/careers" },
  // per-page og:url (the layout's "/" was being inherited); setting openGraph
  // replaces the inherited object, so the share card is re-attached
  openGraph: { url: "/careers", siteName: "Infinium", type: "website", locale: "en_GB", images: ["/opengraph-image"] },
};

export default function Careers() {
  return <CareersWirePage />;
}
