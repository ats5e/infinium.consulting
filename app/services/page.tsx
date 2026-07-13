import type { Metadata } from "next";
import { ServicesWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "Our services",
  description:
    "Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services.",
  alternates: { canonical: "/services" },
};

export default function Services() {
  return <ServicesWirePage />;
}
