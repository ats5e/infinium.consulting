import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { ContactBand } from "@/components/ContactBand";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital transformation, data engineering, data science and governance — for financial institutions only.",
  alternates: { canonical: "/services" },
};

/* Four focus areas — a set, not a sequence: deliberately unnumbered. */
const FOCUS = [
  {
    title: "Digital transformation",
    body: "We guide financial institutions through end-to-end digital change — from data strategy, advisory, and architecture through to cloud migration, application modernisation, and AI readiness assessments. Our consultants bring hands-on experience transforming digital channels and operating models for financial services organisations at every stage of their journey.",
    image: siteImage("digital-transformation"),
    alt: "A basalt monolith dissolving into ordered translucent blue cubes",
  },
  {
    title: "Data engineering",
    body: "We design and build production-grade data pipelines, cloud platforms, and governance frameworks across Alteryx, Databricks, Microsoft Fabric, and Quantexa. Whether through our own proprietary solutions or best-in-class partner platforms, we deliver end-to-end data engineering with a focus on quality, scalability, and AI acceleration.",
    image: siteImage("data-engineering"),
    alt: "Chaotic light resolving through a glass manifold into parallel laminar beams",
  },
  {
    title: "Data science",
    body: "Our data science practice combines big data analytics, entity resolution, UBO resolution, network analytics, and both generative and non-generative AI modelling. With deep Quantexa expertise at its core, we tackle the most complex financial crime, AML, KYC, and risk use cases facing financial institutions today.",
    image: siteImage("data-science"),
    alt: "Glass spheres joined by filaments of cobalt light, clusters resolving",
  },
  {
    title: "Governance",
    body: "We help regulated firms build and embed AI regulation and compliance frameworks, ethical AI design, and data quality observability into their operations. From GDPR and UAE PDPL to EU AI Act readiness and CBUAE and DFSA regulatory reporting, we ensure your data estate meets the standards that matter.",
    image: siteImage("governance"),
    alt: "Twelve parallel etched planes traversed by one unbroken cobalt beam",
  },
];

const PARTNERS = ["Quantexa", "Alteryx", "Microsoft Fabric", "Databricks"];

const ASSESSMENTS = [
  { title: "AI maturity assessment", body: "Where your organisation stands on AI readiness, where it needs to be, and the gap between the two." },
  { title: "Quantexa maturity assessment", body: "The same discipline applied to your Quantexa estate — capability today against the platform’s ceiling." },
  { title: "Knowledge assessment", body: "A structured read on your teams’ skills, mapped against what your roadmap actually requires." },
  { title: "Digital transformation advisory", body: "Legacy modernisation, front-to-back digitisation — from onboarding and digital channels through processing, reporting, and settlement." },
  { title: "Governance", body: "Ownership, lineage, quality standards and control structures — the policies, taxonomies, and metadata practices that turn raw data into a trusted, auditable asset." },
];

export default function Services() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <p className="eyebrow">we serve</p>
          <h1 className="mt-6 max-w-4xl text-(length:--text-step-5) leading-[1.02]">
            Four focus areas. One industry.
          </h1>
        </div>
      </section>

      {FOCUS.map((f, i) => (
        <section key={f.title} className="border-t hairline">
          <Reveal
            className={`mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) py-20 md:grid-cols-2 ${
              i % 2 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-(length:--text-step-3)">{f.title}</h2>
              <p className="mt-6 max-w-xl leading-relaxed text-ice">{f.body}</p>
            </div>
            <GlassImage image={f.image} alt={f.alt} sizes="(min-width: 768px) 45vw, 100vw" />
          </Reveal>
        </section>
      ))}

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">technology</p>
          <h2 className="mt-6 max-w-3xl text-(length:--text-step-3)">
            We partner with the platforms that matter in financial services.
          </h2>
          <p className="mt-4 max-w-xl text-ice">
            Every consultant is certified by the provider.
          </p>
          <Reveal className="mt-10 grid grid-cols-2 gap-px md:grid-cols-4">
            {PARTNERS.map((p) => (
              <div key={p} className="border hairline p-8 text-center font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-glass">
                {p}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">assessments &amp; advisory</p>
          <Reveal className="mt-10 divide-y divide-ice/12 border-y hairline">
            {ASSESSMENTS.map((a) => (
              <article key={a.title} className="grid gap-4 py-8 md:grid-cols-12">
                <h3 className="text-(length:--text-step-1) md:col-span-5">{a.title}</h3>
                <p className="text-ice md:col-span-7">{a.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
