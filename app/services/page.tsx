import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ContactBand } from "@/components/ContactBand";
import { PartnerLogos } from "@/components/PartnerLogos";
import { siteImage, type SiteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital transformation, data engineering, data science and governance — for financial institutions only.",
  alternates: { canonical: "/services" },
};

/* Four focus areas — a set, not a sequence: deliberately unnumbered. */
const FOCUS: Array<{
  title: string;
  lead: string;
  body: string;
  tags: string[];
  image: SiteImage;
}> = [
  {
    title: "Digital transformation",
    lead: "End-to-end digital change, from strategy to shipped.",
    body: "Data strategy, advisory and architecture through to cloud migration, application modernisation and AI readiness — for financial services organisations at every stage of the journey.",
    tags: ["Cloud migration", "Application modernisation", "AI readiness"],
    image: siteImage("digital-transformation"),
  },
  {
    title: "Data engineering",
    lead: "Production-grade pipelines and platforms.",
    body: "Designed and built across Alteryx, Databricks, Microsoft Fabric and Quantexa — through our own products or best-in-class partner platforms, with quality, scale and AI acceleration as the baseline.",
    tags: ["Production pipelines", "Cloud platforms", "Governance frameworks"],
    image: siteImage("data-engineering"),
  },
  {
    title: "Data science",
    lead: "The hardest financial crime and risk use cases.",
    body: "Entity resolution, UBO resolution, network analytics, and generative and non-generative AI modelling — with deep Quantexa expertise at the core of AML, KYC and risk work.",
    tags: ["Entity resolution", "Network analytics", "AML · KYC · risk"],
    image: siteImage("data-science"),
  },
  {
    title: "Governance",
    lead: "The standards that matter, embedded in operations.",
    body: "AI regulation and compliance frameworks, ethical AI design and data quality observability — from GDPR and UAE PDPL to EU AI Act readiness and CBUAE and DFSA regulatory reporting.",
    tags: ["UAE PDPL · GDPR", "EU AI Act readiness", "CBUAE · DFSA reporting"],
    image: siteImage("governance"),
  },
];

const ASSESSMENTS = [
  { title: "AI maturity assessment", body: "Where your organisation stands on AI readiness, where it needs to be, and the gap between the two." },
  { title: "Quantexa maturity assessment", body: "The same discipline applied to your Quantexa estate — capability today against the platform’s ceiling." },
  { title: "Knowledge assessment", body: "A structured read on your teams’ skills, mapped against what your roadmap actually requires." },
  { title: "Digital transformation advisory", body: "Legacy modernisation, front-to-back digitisation — from onboarding and digital channels through processing, reporting, and settlement." },
  { title: "Governance", body: "Ownership, lineage, quality standards and control structures — the policies, taxonomies, and metadata practices that turn raw data into a trusted, auditable asset." },
];

/* Focus panel — the image boxed behind the text, per the site language. */
function FocusPanel({ f }: { f: (typeof FOCUS)[number] }) {
  return (
    <article className="group relative overflow-hidden border hairline transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo) hover:border-signal/50">
      <picture aria-hidden className="absolute inset-0">
        <source type="image/avif" srcSet={`${f.image.avifHalf} ${Math.round(f.image.width / 2)}w`} />
        <img
          src={f.image.webpHalf}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${f.image.lqip})`, backgroundSize: "cover" }}
        />
      </picture>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/97 via-void/75 to-void/25" />

      <div className="relative flex min-h-[24rem] flex-col justify-end p-8 md:p-10">
        <h2 className="text-(length:--text-step-2)">{f.title}</h2>
        <p className="mt-2 text-(length:--text-step-1) text-glass">{f.lead}</p>
        <p className="mt-4 max-w-xl text-(length:--text-body-sm) leading-relaxed text-ice">{f.body}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {f.tags.map((tag) => (
            <li
              key={tag}
              className="border hairline bg-void/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-steel backdrop-blur-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <>
      <section className="pb-14 pt-40">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <p className="eyebrow">we serve</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1 className="text-(length:--text-step-5) leading-[1.03] lg:col-span-7">
              Four focus areas.
              <br />
              One industry.
            </h1>
            <p className="max-w-md text-ice lg:col-span-5">
              End-to-end technology engagements across the financial services
              value chain — from strategy through production engineering and
              beyond. Financial services only, by design.
            </p>
          </div>
        </div>
      </section>

      {/* the four focus areas — image boxed behind the text */}
      <section aria-label="Focus areas">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <div className="grid gap-4 lg:grid-cols-2">
            {FOCUS.map((f) => (
              <FocusPanel key={f.title} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* certified partner stack */}
      <section className="mt-20 border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow">technology</p>
              <h2 className="mt-5 text-(length:--text-step-3)">
                Certified across the platforms that matter.
              </h2>
              <p className="mt-4 max-w-md text-ice">
                We partner with the platforms financial services actually runs
                on — and every consultant is certified by the provider.
              </p>
            </div>
            <div className="lg:col-span-7">
              <PartnerLogos tileClass="px-6 py-8" />
            </div>
          </div>
        </div>
      </section>

      {/* assessments & advisory */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">assessments &amp; advisory</p>
              <h2 className="mt-5 max-w-2xl text-(length:--text-step-3)">
                Know where you stand before you build.
              </h2>
            </div>
            <Link
              href="/contact"
              className="link-wipe text-[11.5px] font-medium uppercase tracking-[0.08em] text-signal"
            >
              Book an assessment →
            </Link>
          </div>
          <Reveal className="mt-10 divide-y divide-ice/12 border-y hairline">
            {ASSESSMENTS.map((a) => (
              <article
                key={a.title}
                className="grid gap-3 py-6 transition-colors duration-(--duration-fast) md:grid-cols-12"
              >
                <h3 className="text-(length:--text-step-1) md:col-span-5">{a.title}</h3>
                <p className="text-(length:--text-body-sm) leading-relaxed text-ice md:col-span-7">
                  {a.body}
                </p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <ContactBand heading="Tell us which of the four you’re wrestling with." />
    </>
  );
}
