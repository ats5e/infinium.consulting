import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { ContactBand } from "@/components/ContactBand";
import { QBricksWord } from "@/components/QBricksWord";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "QBricks",
  description:
    "Governed, AI-ready data without pipelines. QBricks enforces governance at the point of ingestion — data contracts, lineage, and local compute.",
  alternates: { canonical: "/products/qbricks" },
};

/*
 * QBricks carries its own product identity — the ember red #FF3A26 and the
 * Quicksand wordmark, from qbricks.vercel.app. The accent shifts to red on
 * this page only. Copy sourced from the QBricks site (design/CONTENT.md).
 */

const WITHOUT = [
  "Thousands of ungoverned notebooks",
  "Teams of data engineers",
  "Lengthy pipeline build and deployment timelines",
  "AI-required data locked at the bronze layer",
  "Ongoing compute costs",
];

const WITH = [
  "Data governance enforced (ODCS) — no notebooks",
  "Small engineering team, at set-up only",
  "Streaming data, materialised views",
  "AI-ready data available in hours, not years",
  "Low compute costs — no cloud requirement",
];

const NUMBERS = [
  {
    figure: "$650B",
    body: "of annual revenue — in perpetuity — required for a 10% return on the AI infrastructure buildout.",
    source: "J.P. Morgan analysts",
  },
  {
    figure: "100×",
    body: "the compute a reasoning model can need over single-shot inference — while most “AI spend” still feeds data preparation.",
    source: "White paper — why the AI numbers don’t add up",
  },
  {
    figure: "2×",
    body: "the cost of every Microsoft Fabric capacity upgrade step — a blunt instrument for what is usually one inefficient pipeline.",
    source: "White paper — the hidden cost of Fabric compute",
  },
];

const AGENTIC = [
  { t: "Governed agentic mesh", b: "Learns, recommends and executes — with human approval and full lineage." },
  { t: "Agentic automation", b: "Agents handle routine metadata work and act according to your governance policy." },
  { t: "Data lineage", b: "Drill into any data product and see a visualisation of the joins and underlying tables that made it." },
  { t: "Knowledge graphs", b: "Clickable graphs for a full, detailed understanding of your organisation’s data." },
  { t: "Human in the loop", b: "Automation scales the work; your governance, risk and data teams retain review, control and accountability." },
];

const PLATFORM = [
  { t: "Streaming & incremental", b: "Real-time, change-focused updates underpinned by the Open Data Contract Standard." },
  { t: "Governance enforced by contract", b: "Records are compared digitally to your governance framework at ingestion. Nothing ungoverned gets through." },
  { t: "Automatic pipeline building", b: "Complex builds and joins performed by the platform — trusted data products in hours, not months." },
  { t: "Knowledge graph & lineage", b: "Hierarchy, linkages and complex relationships; supports ontologies and full data lineage." },
  { t: "Local compute", b: "Databricks, Fabric, Snowflake or your own database via SQL push-down — enterprise scale on the compute you already own." },
  { t: "Fully auditable", b: "Before-and-after files and auditable outputs, under Databricks, Microsoft or Snowflake security standards." },
];

const SYSTEMS = [
  ["Core banking", "Temenos · Flexcube"],
  ["Payments", "SWIFT · SEPA · Instant"],
  ["Cards", "Issuing · Processing"],
  ["Treasury & trading", "Murex · Calypso"],
  ["CRM & onboarding", "Salesforce · Dynamics"],
];

const LANES = [
  ["Lane 01", "BI & analytics"],
  ["Lane 02", "AI & ML serving"],
  ["Lane 03", "Operational activation"],
];

export default function QBricks() {
  return (
    <>
      <section className="pt-36 pb-16">
        <div className="mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow">
              <Link href="/products" className="transition-colors hover:text-glass">we build</Link>
              <span aria-hidden> / </span>
              <QBricksWord className="text-[12px] tracking-[0.08em]" />
            </p>
            <h1 className="mt-6 text-(length:--text-step-5) leading-[1.05]">
              No more data pipelines.
            </h1>
            <p className="mt-6 max-w-xl text-(length:--text-step-1) text-glass">
              Turn your systems of record into governed, AI-ready data
              products — in hours, not months or years.
            </p>
            <p className="mt-4 max-w-xl text-ice">
              <QBricksWord /> is a streaming data-management platform that
              enforces governance at the point of ingestion, so the data
              landing in your lakehouse or database is already trusted,
              governed and AI-ready.
            </p>
          </div>
          <Reveal className="md:col-span-6">
            <GlassImage
              image={siteImage("qbricks")}
              alt="A monolith of interlocking glass bricks lit in deep crimson"
              sizes="(min-width: 768px) 45vw, 66vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) gap-12 px-(--spacing-gutter) py-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow">the executive problem</p>
            <h2 className="mt-5 text-(length:--text-step-3)">
              Everyone is racing to deploy AI. The underlying data is not
              ready.
            </h2>
            <div className="mt-6 max-w-2xl space-y-4 text-ice">
              <p>
                A 2025 MIT report found that around 95% of AI-related use
                cases were failing — not because the models were weak, but
                because the underlying data quality and metadata foundation
                could not be trusted.
              </p>
              <p>
                To date, the answer has been to throw money at the problem:
                remediation, data engineers, management platforms, pipeline
                building and its permanent maintenance — all underpinned by
                cloud and compute costs. Organisations are now recognising
                that those costs outweigh the savings AI was meant to
                deliver.
              </p>
              <p className="text-glass">
                A different approach is needed. <QBricksWord />.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-px md:col-span-5">
            <div className="border hairline p-6">
              <p className="eyebrow">without qbricks</p>
              <ul className="mt-4 space-y-2 text-(length:--text-body-sm) text-steel">
                {WITHOUT.map((w) => (
                  <li key={w}>— {w}</li>
                ))}
              </ul>
            </div>
            <div className="border hairline border-[#FF3A26]/40 p-6">
              <p className="eyebrow text-[#FF3A26]">with qbricks</p>
              <ul className="mt-4 space-y-2 text-(length:--text-body-sm) text-glass">
                {WITH.map((w) => (
                  <li key={w}>— {w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">the numbers</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-step-3)">
            The economics only work when trusted data stops being the most
            expensive line on the bill.
          </h2>
          <Reveal className="mt-10 grid gap-px md:grid-cols-3">
            {NUMBERS.map((n) => (
              <article key={n.figure} className="border hairline p-6">
                <p className="font-display text-(length:--text-step-4) font-medium tabular-nums text-paper">
                  {n.figure}
                </p>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{n.body}</p>
                <p className="eyebrow mt-4">{n.source}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">secure agentic metadata management</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-step-3)">
            Automate the heavy work. Audit everything.
          </h2>
          <p className="mt-5 max-w-2xl text-ice">
            <QBricksWord /> automates the data-management process — creating
            data contracts, performing complex pipeline builds and joins,
            and producing data products for your existing platforms or your
            own database — while you keep complete control of every data
            product.
          </p>
          <Reveal className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-5">
            {AGENTIC.map((c) => (
              <article key={c.t} className="border hairline p-5">
                <h3 className="text-(length:--text-body) font-medium text-paper">{c.t}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{c.b}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">what qbricks is</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-step-3)">
            A governed, secure data platform for your organisation.
          </h2>
          <Reveal className="mt-10 divide-y divide-ice/12 border-y hairline">
            {PLATFORM.map((c) => (
              <article key={c.t} className="grid gap-3 py-6 md:grid-cols-12">
                <h3 className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-[#FF3A26] md:col-span-4">
                  {c.t}
                </h3>
                <p className="text-(length:--text-body-sm) text-ice md:col-span-8">{c.b}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">the ecosystem</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-step-3)">
            Feed any AI use case, in hours.
          </h2>
          <p className="mt-5 max-w-2xl text-ice">
            <QBricksWord /> streams governed, AI-ready data from your systems
            of record straight into production use cases — accelerating the
            platforms you already run.
          </p>
          <div className="mt-10 grid gap-px lg:grid-cols-3">
            <div className="border hairline p-6">
              <p className="eyebrow">systems of record</p>
              <ul className="mt-4 space-y-3">
                {SYSTEMS.map(([k, v]) => (
                  <li key={k} className="flex items-baseline justify-between gap-4">
                    <span className="text-(length:--text-body-sm) text-glass">{k}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-steel">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border hairline border-[#FF3A26]/40 p-6">
              <p className="eyebrow text-[#FF3A26]">data management platform</p>
              <p className="mt-4 text-(length:--text-body-sm) text-glass">
                Governed, AI-ready data — in hours, not years.
              </p>
              <ul className="mt-4 space-y-2 text-(length:--text-body-sm) text-ice">
                {["Automatic pipeline building", "Local compute", "Materialised views", "Catalogue of catalogues"].map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <p className="eyebrow mt-5">governed · contract-enforced · audit-ready</p>
            </div>
            <div className="border hairline p-6">
              <p className="eyebrow">the lakehouse</p>
              <p className="mt-4 text-(length:--text-body-sm) text-glass">Governed landing zone → consumption lanes</p>
              <ul className="mt-4 space-y-3">
                {LANES.map(([lane, use]) => (
                  <li key={lane} className="flex items-baseline justify-between gap-4">
                    <span className="text-(length:--text-body-sm) text-glass">{use}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-steel">{lane}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">in production</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-step-3)">
            Running in production at tier-1 financial institutions.
          </h2>
          <p className="mt-4 max-w-xl text-ice">
            Client names are confidential. The sentence is the proof.
          </p>
          <p className="mt-8">
            <Link href="/products/tbricks" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">
              Related: TBricks →
            </Link>
          </p>
        </div>
      </section>

      <ContactBand heading="See QBricks against your own data estate." />
    </>
  );
}
