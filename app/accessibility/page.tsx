import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, HeroSection } from "@/components/wireframe/Primitives";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "Our accessibility target for this website, how we test it, and how to tell us when we miss.",
  alternates: { canonical: "/accessibility" },
};

const SECTIONS = [
  {
    title: "Our target",
    body: "We aim for this website to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA.",
  },
  {
    title: "How we test",
    body: "Every page in the sitemap runs through automated axe accessibility audits at WCAG AA on both desktop and mobile viewports as part of our engineering pipeline — a release does not ship if a page fails. Automated checks are complemented by manual keyboard and screen-reader spot checks.",
  },
  {
    title: "Motion and animation",
    body: "The site uses animation deliberately. Every animation respects your operating system's reduced-motion preference: with it enabled, moving graphics render as still images and content appears without transitions.",
  },
  {
    title: "Keyboard and structure",
    body: "All navigation, menus, search and forms are operable by keyboard, with visible focus states. Pages use a single H1 and a logical heading structure; images carry meaningful alternative text or are marked decorative.",
  },
  {
    title: "Known limitations",
    body: "Some downloadable documents (PDF one-pagers) may not yet meet the same standard as the website itself. If you need any content in an accessible format, contact us and we will provide it.",
  },
] as const;

export default function AccessibilityPage() {
  return (
    <>
      <HeroSection
        eyebrow="Legal"
        title="Accessibility statement"
        body="This website should work for everyone, with every input, at every speed. Here is the standard we hold it to — and where to write when we fall short."
      />
      <ContentSection>
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-ice/12 border-y hairline">
            {SECTIONS.map((s) => (
              <section key={s.title} className="grid gap-3 py-8 md:grid-cols-12">
                <h2 className="text-(length:--text-step-1) md:col-span-4">{s.title}</h2>
                <p className="leading-relaxed text-ice md:col-span-8">{s.body}</p>
              </section>
            ))}
          </div>
          <p className="mt-10 text-ice">
            Found something we missed?{" "}
            <Link href="/contact" className="link-wipe text-signal">Tell us</Link> and we will fix it.
          </p>
        </div>
      </ContentSection>
    </>
  );
}
