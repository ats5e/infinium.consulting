import type { Metadata } from "next";
import { EsgPartnersPage } from "@/components/wireframe/EsgMicrosite";

/* Unlisted, carried over from csrd.consulting for David's review (see
 * components/wireframe/EsgMicrosite.tsx): outside ALL_PATHS and noindex. */
export const metadata: Metadata = {
  title: "ESG technology partners",
  description: "The technology partners behind our ESG reporting solution.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EsgPartnersPage />;
}
