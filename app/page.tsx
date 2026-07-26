import type { Metadata } from "next";
import { HomeWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  // the root page sits beside the root layout, so the title template does
  // not apply — spell the brand out explicitly
  title: { absolute: "Engineering with context — Infinium Technology" },
  description:
    "Banking & financial services consultancy. We help the world's leading financial services firms transform their businesses through industry expertise, AI and automation.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomeWirePage />;
}
