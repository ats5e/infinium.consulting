import type { Metadata } from "next";
import { EsgChallengesPage } from "@/components/wireframe/EsgMicrosite";

/* Unlisted, carried over from csrd.consulting for David's review (see
 * components/wireframe/EsgMicrosite.tsx): outside ALL_PATHS and noindex. */
export const metadata: Metadata = {
  title: "ESG reporting challenges",
  description: "The data, tooling and audit challenges ESG reporting presents to financial institutions and corporates.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <EsgChallengesPage />;
}
