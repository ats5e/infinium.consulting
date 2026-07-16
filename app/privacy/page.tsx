import type { Metadata } from "next";
import Link from "next/link";
import { ContentSection, HeroSection } from "@/components/wireframe/Primitives";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: "How Infinium Technology handles information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS = [
  {
    title: "Information we collect",
    body: "When you contact us, we collect the details you choose to provide, including your name, work email, enquiry topic and message. If you opt in to updates, we also record that preference.",
  },
  {
    title: "How we use it",
    body: "We use enquiry information to respond, understand your organisation’s needs and continue the conversation you requested. We use an updates preference only to send occasional Infinium communications. We do not sell personal information.",
  },
  {
    title: "Service providers",
    body: "This website is hosted by Vercel and uses Vercel performance and aggregate analytics services in production. Contact enquiries may be delivered using Resend. These providers process limited information on our behalf to operate and improve the website.",
  },
  {
    title: "Retention and security",
    body: "We retain enquiry information only for as long as it is reasonably needed to manage the relationship, meet legal obligations and maintain appropriate business records. We use proportionate technical and organisational safeguards to protect it.",
  },
  {
    title: "Your choices and rights",
    body: "You can ask us to access, correct or delete personal information we hold about you, object to or restrict certain processing, or withdraw an updates preference at any time. Applicable rights vary by location.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <HeroSection
        eyebrow="Legal"
        title="Privacy notice"
        body="A clear account of the limited information this website handles and how to contact us about it."
      />
      <ContentSection density="compact">
        <div className="grid gap-px border hairline lg:grid-cols-2">
          {SECTIONS.map((section) => (
            <section key={section.title} className="bg-white/72 p-7 sm:p-9">
              <h2 className="text-(length:--text-step-1)">{section.title}</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ice">{section.body}</p>
            </section>
          ))}
          <section className="bg-surface/82 p-7 sm:p-9">
            <h2 className="text-(length:--text-step-1)">Contact us</h2>
            <p className="mt-4 leading-relaxed text-ice">
              For privacy questions or requests, email{" "}
              <a className="underline decoration-navy/20 underline-offset-4 transition-colors hover:text-signal" href="mailto:sales@infinium.technology">
                sales@infinium.technology
              </a>
              . You can also use our{" "}
              <Link className="underline decoration-navy/20 underline-offset-4 transition-colors hover:text-signal" href="/contact">
                contact form
              </Link>
              .
            </p>
            <p className="eyebrow mt-7">Last updated 16 July 2026</p>
          </section>
        </div>
      </ContentSection>
    </>
  );
}
