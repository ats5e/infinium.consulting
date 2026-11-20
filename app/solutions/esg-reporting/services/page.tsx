import type { Metadata } from "next";
import { EsgServicesPage } from "@/components/wireframe/EsgMicrosite";

/* Unlisted, carried over from csrd.consulting for David's review (see
 * components/wireframe/EsgMicrosite.tsx): outside ALL_PATHS and noindex. */
export const metadata: Metadata = {
  title: "ESG reporting services",
  description: "How we support ESG reporting, from strategy and materiality assessment to data collection and disclosure.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EsgServicesPage />;
}
