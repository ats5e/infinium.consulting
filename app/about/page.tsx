import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { TeamSection } from "@/components/TeamSection";
import { ContactBand } from "@/components/ContactBand";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Built by practitioners, for practitioners. Founded by David Aston in the DIFC — a financial-services-only technology firm.",
  alternates: { canonical: "/about" },
};

const MISSION = [
  {
    label: "Outcome-focused",
    body: "To make financial institutions faster, sharper, and more resilient through technology that’s built by people who understand the industry from the inside.",
  },
  {
    label: "Purpose-driven",
    body: "To raise the standard of what financial services firms can expect from a technology partner — by combining genuine domain expertise with engineering that actually ships.",
  },
  {
    label: "Practitioner",
    body: "To be the technology firm that financial institutions wished existed — built by practitioners, focused entirely on their industry, and committed to staying until the job is done.",
  },
];

export default function About() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto grid max-w-(--container-content) items-end gap-12 px-(--spacing-gutter) md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow">our story</p>
            <h1 className="mt-6 text-(length:--text-step-5) leading-[1.02]">
              Built by practitioners, for&nbsp;practitioners.
            </h1>
          </div>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) gap-12 px-(--spacing-gutter) py-20 md:grid-cols-12">
          <Reveal className="space-y-6 text-ice md:col-span-6">
            <p>
              Infinium was founded by David Aston, a veteran of over three
              decades in financial services technology and transformation. His
              career has spanned the world’s major financial centres — Dubai,
              London, New York, Hong Kong, Amsterdam, Tokyo — working at the
              intersection of complex regulation, institutional change, and
              emerging technology.
            </p>
            <p>
              The firm was founded on a straightforward conviction: the
              financial services industry deserves technology partners who
              truly understand it. Not firms that parachute in with generic
              methodologies, but specialists who speak the language of risk,
              compliance, and data — and who can engineer the solutions
              themselves.
            </p>
            <p>
              We chose the DIFC deliberately. As the Middle East’s premier
              financial centre and a globally recognised regulatory
              environment, it places us at the heart of the ecosystem we serve
              — and holds us to the same standards we ask of our clients.
            </p>
            <p className="eyebrow">— David Aston, CEO</p>
          </Reveal>
          <Reveal className="md:col-span-6">
            <GlassImage
              image={siteImage("about-difc")}
              alt="Dawn light entering an abstract interior of black glass and polished stone"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">our mission</p>
          <Reveal className="mt-10 grid gap-px md:grid-cols-3">
            {MISSION.map((m) => (
              <article key={m.label} className="border hairline p-8">
                <p className="eyebrow text-signal">{m.label}</p>
                <p className="mt-4 leading-relaxed text-glass">{m.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) gap-16 px-(--spacing-gutter) py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">financial services</p>
            <h2 className="mt-6 text-(length:--text-step-2)">
              Specialised in financial services firms — when you need help,
              we’ve already done it before.
            </h2>
            <p className="mt-6 text-ice">
              A deep portfolio of projects across asset management, insurance,
              banking, and financial markets.
            </p>
          </Reveal>
          <Reveal>
            <p className="eyebrow">data services</p>
            <h2 className="mt-6 text-(length:--text-step-2)">
              Deep technical knowledge — we don’t just use the tech, we build
              it.
            </h2>
            <p className="mt-6 text-ice">
              Years of technical delivery, every consultant certified in our
              partner platforms, and our own products alongside them.
            </p>
          </Reveal>
        </div>
      </section>

      <TeamSection intro="Practitioners turned consultants, specialised in data — from governance to full-stack development." />
      <ContactBand />
    </>
  );
}
