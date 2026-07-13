import type { Metadata } from "next";
import { AboutWirePage } from "@/components/wireframe/Pages";

export const metadata: Metadata = {
  title: "About us",
  description: "It's all about business outcomes.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutWirePage />;
}
