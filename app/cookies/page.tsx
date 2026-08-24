import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, HeroSection } from "@/components/wireframe/Primitives";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "What this website stores in your browser — which is very little.",
  alternates: { canonical: "/cookies" },
};

const SECTIONS = [
  {
    title: "No advertising or tracking cookies",
    body: "This website sets no advertising cookies, no cross-site tracking cookies and no social media cookies. There is no cookie banner because there is nothing to consent to.",
  },
  {
    title: "Analytics without cookies",
    body: "In production we use Vercel Web Analytics and Speed Insights to understand aggregate page performance and visits. These services are designed to work without cookies and without building profiles of individual visitors.",
  },
  {
    title: "Essential operation",
    body: "The website may use strictly necessary browser storage for basic operation — for example, remembering that an embedded video player was activated during your visit. Nothing in this category identifies you or follows you to other sites.",
  },
  {
    title: "Embedded media",
    body: "Office films on this site are click-to-load. Until you press play, nothing is requested from the video providers (Mux, YouTube). When you do press play, the provider may set its own cookies under its own policy — that choice stays with you.",
  },
  {
    title: "If this changes",
    body: "If we ever introduce cookies that require consent, this page will change first and a consent mechanism will appear before anything is set.",
  },
] as const;

export default function CookiesPage() {
  return (
    <>
      <HeroSection
        eyebrow="Legal"
        title="Cookie policy"
        body="The short version: this website works without tracking you, so there is no cookie banner to click away."
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
            How we handle information you send us is covered by the{" "}
            <Link href="/privacy" className="link-wipe text-signal">privacy notice</Link>.
          </p>
        </div>
      </ContentSection>
    </>
  );
}
