import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, HeroSection } from "@/components/wireframe/Primitives";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms on which this website is provided.",
  alternates: { canonical: "/terms" },
};

const SECTIONS = [
  {
    title: "Who we are",
    body: "This website is operated by Infinium Consulting B.V., Fred. Roeskestraat 115, Amsterdam, The Netherlands, together with Infinium Technology Ltd, DIFC, Dubai. References to “Infinium”, “we” or “us” are to those entities.",
  },
  {
    title: "Use of this website",
    body: "This website describes our services, solutions and firm. You may browse it and share links to it. You may not misuse it, attempt to gain unauthorised access to it, or use its content in a way that misrepresents Infinium.",
  },
  {
    title: "Content is informational",
    body: "Pages, case studies and downloads are provided for general information. They describe experience and capability; they are not professional, legal, regulatory or investment advice, and no engagement or commitment is created by reading them. Engagements with Infinium are governed by separate written agreements.",
  },
  {
    title: "Intellectual property",
    body: "The Infinium name, the QBricks and VBricks marks, and the content, design and imagery of this website belong to Infinium or its licensors. Third-party marks, including Alteryx, Appian, Databricks, Microsoft and Quantexa, belong to their respective owners and appear here to describe genuine partnerships.",
  },
  {
    title: "Third-party links",
    body: "Where we link to other websites, we do so in good faith. We are not responsible for their content or their handling of your information.",
  },
  {
    title: "Liability",
    body: "We take care to keep this website accurate and available, but it is provided “as is”. To the extent permitted by law, Infinium accepts no liability for loss arising from reliance on website content or from interruption of the website itself.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of the Netherlands, and any dispute relating to this website is subject to the jurisdiction of the courts of Amsterdam.",
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <HeroSection
        eyebrow="Legal"
        title="Terms of use"
        body="The terms on which this website is provided. Reading our pages costs you nothing and commits you to nothing — here is the formal version of that."
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
            Questions about these terms? <Link href="/contact" className="link-wipe text-signal">Contact us</Link>.
          </p>
        </div>
      </ContentSection>
    </>
  );
}
