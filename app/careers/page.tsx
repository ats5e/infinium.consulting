import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "We hire practitioners. Open roles appear here — and we read speculative applications properly.",
  alternates: { canonical: "/careers" },
};

export default function Careers() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <p className="eyebrow">careers</p>
          <h1 className="mt-6 max-w-4xl text-(length:--text-step-5) leading-[1.02]">
            We hire practitioners.
          </h1>
          <p className="mt-8 max-w-xl text-ice">
            40+ specialists, 17 nationalities, one industry. People who have
            done the work inside banks, regulators, and trading floors — and
            want to build the technology they wished they’d had.
          </p>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">open roles</p>
            <h2 className="mt-6 text-(length:--text-step-3)">
              There are no open roles right now.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-ice">
              When there are, they’ll be here. If you think we should know
              about you anyway, we probably should — send a CV and a short
              note on what you’ve built to{" "}
              <a href="mailto:sales@infinium.technology" className="link-wipe text-signal">
                sales@infinium.technology
              </a>
              . Speculative applications get read properly.
            </p>
          </Reveal>
          <Reveal>
            <GlassImage
              image={siteImage("careers")}
              alt="An empty glass-walled workspace at dawn"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">how we work</p>
          <Reveal className="mt-10 grid gap-px md:grid-cols-3">
            {[
              { t: "Build, don’t decorate", b: "Everyone here ships. Consultants write code, engineers meet clients, and nobody’s deliverable is a slide deck." },
              { t: "Domain first", b: "You’ll learn AML, credit risk, and regulatory reporting properly — because our clients can tell when a partner hasn’t." },
              { t: "Stay until it works", b: "Rolling engagements mean you see your work in production, not just in the proposal." },
            ].map((v) => (
              <article key={v.t} className="border hairline p-8">
                <h3 className="text-(length:--text-step-1)">{v.t}</h3>
                <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{v.b}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
