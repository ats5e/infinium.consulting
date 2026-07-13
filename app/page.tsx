import type { Metadata } from "next";
import { HomeWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  // the root page sits beside the root layout, so the title template does
  // not apply — spell the brand out explicitly
  title: { absolute: "Engineering with context — Infinium Technology" },
  description: "Banking & financial services consultancy.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeWirePage />;
}
