import type { Metadata } from "next";
import { EsgFaqsPage } from "@/components/wireframe/EsgMicrosite";

/* Unlisted, carried over from csrd.consulting for David's review (see
 * components/wireframe/EsgMicrosite.tsx): outside ALL_PATHS and noindex. */
export const metadata: Metadata = {
  title: "ESG reporting FAQs",
  description: "Frequently asked questions about our ESG reporting services.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EsgFaqsPage />;
}
