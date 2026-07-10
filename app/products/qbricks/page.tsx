import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { ContactBand } from "@/components/ContactBand";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "QBricks",
  description:
    "Governed, AI-ready data without pipelines. QBricks enforces governance at the point of ingestion — data contracts, lineage, and local compute.",
  alternates: { canonical: "/products/qbricks" },
};

/*
 * QBricks carries its own red/black product identity (#D6111F / #FF4A50,
 * from qbricks.vercel.app) — the accent shifts to red on this page only.
 */
const CAPABILITIES = [
  { label: "governance by contract", body: "Records are compared digitally to your governance framework at the point of ingestion (Open Data Contract Standard). Nothing ungoverned gets through." },
  { label: "automatic pipeline building", body: "Complex pipeline builds and joins performed by the platform — data products land in your lakehouse or database already trusted, in hours rather than months." },
  { label: "local compute", body: "Works with Databricks, Fabric, Snowflake or your own database via SQL push-down. Enterprise scale on the compute you already own, at a fraction of the cost." },
  { label: "lineage & knowledge graphs", body: "Every transformation, agent action and exception traceable — drill into any data product and see exactly how it was made." },
  { label: "agentic metadata, human in the loop", body: "Agents handle routine metadata work under your governance policy. Your risk and data teams retain review, control, and accountability." },
  { label: "fully auditable", body: "Before-and-after files and auditable outputs, under the security standards of the platforms you already run." },
];

export default function QBricks() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow">
              <Link href="/products" className="transition-colors hover:text-glass">we build</Link>
              <span aria-hidden> / </span>
              <span className="text-[#FF4A50]">qbricks</span>
            </p>
            <h1 className="mt-6 text-(length:--text-step-5) leading-[1.02]">
              No more data pipelines.
            </h1>
            <p className="mt-8 max-w-xl text-(length:--text-step-1) text-glass">
              Turn your systems of record into governed, AI-ready data
              products — in hours, not months or years.
            </p>
          </div>
          <Reveal className="md:col-span-6">
            <GlassImage
              image={siteImage("qbricks")}
              alt="A monolith of interlocking glass bricks lit in deep crimson"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">the executive problem</p>
          <Reveal className="mt-8 max-w-3xl space-y-6">
            <h2 className="text-(length:--text-step-3)">
              Everyone is racing to deploy AI. The underlying data is not
              ready.
            </h2>
            <p className="text-ice">
              The answer to date has been to throw money at the problem —
              remediation, engineers, management platforms, pipeline building
              and its permanent maintenance, all underpinned by cloud and
              compute costs. Organisations are recognising that those costs
              outweigh the savings AI was meant to deliver. A different
              approach is needed.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">what it does</p>
          <Reveal className="mt-10 divide-y divide-ice/12 border-y hairline">
            {CAPABILITIES.map((c) => (
              <article key={c.label} className="grid gap-4 py-8 md:grid-cols-12">
                <h3 className="font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-[#FF4A50] md:col-span-4">
                  {c.label}
                </h3>
                <p className="text-ice md:col-span-8">{c.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">in production</p>
          <h2 className="mt-6 max-w-3xl text-(length:--text-step-3)">
            Running in production at tier-1 financial institutions.
          </h2>
          <p className="mt-4 max-w-xl text-ice">
            Client names are confidential. The sentence is the proof.
          </p>
          <p className="mt-10">
            <Link href="/products/tbricks" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-signal">
              Related: TBricks →
            </Link>
          </p>
        </div>
      </section>

      <ContactBand heading="Start a conversation about QBricks." />
    </>
  );
}
