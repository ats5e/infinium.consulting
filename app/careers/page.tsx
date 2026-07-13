import type { Metadata } from "next";
import { CareersWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "Your career",
  description:
    "We are a values-led firm built from seasoned professionals and dynamic new talent.",
  alternates: { canonical: "/careers" },
};

export default function Careers() {
  return <CareersWirePage />;
}
