import type { Metadata } from "next";
import { HomeWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  // the root page sits beside the root layout, so the title template does
  // not apply — spell the brand out explicitly
  title: { absolute: "Months, not years — Infinium Technology" },
  description:
    "Engineering excellence combined with deep industry expertise. Turning data into decisions for the world's leading banks, insurers and asset managers.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeWirePage />;
}
