"use client";

import { useState } from "react";
import Link from "next/link";

/*
 * The operating model, stated plainly: three layers — Strategy, Build,
 * Operate — one clean panel each. No dashboard cosplay: no invented
 * scores, no fake telemetry. The tab switch is the interaction; the
 * content is the point.
 */

const MODES = [
  {
    label: "Strategy",
    n: "01",
    title: "Decisions built to survive delivery.",
    body: "We turn board-level ambition into governed delivery slices — the first production path, the operating model, the controls, and the evidence needed to keep risk, compliance and technology aligned.",
    points: [
      "First production path defined and agreed",
      "Operating model and controls designed together",
      "Regulatory position mapped before build starts",
    ],
  },
  {
    label: "Build",
    n: "02",
    title: "Architecture that ships, tests and audits.",
    body: "Our consultants stay close to the code. Data products, lineage, test harnesses and automation are built in the same cadence as the advisory work — the blueprint is never separated from the machine.",
    points: [
      "Data products with contracts and lineage",
      "Test harnesses and automation from day one",
      "Built on the compute you already own",
    ],
  },
  {
    label: "Operate",
    n: "03",
    title: "Production with proof, from day one.",
    body: "We build for regulated institutions: model behaviour, data quality, lineage and approvals are visible as operating facts — not reconstructed later for audit. Speed, with evidence.",
    points: [
      "Model behaviour and data quality observable",
      "Approvals and lineage captured as they happen",
      "Audit evidence produced by the system itself",
    ],
  },
] as const;

export function ExperienceConsole() {
  const [active, setActive] = useState(0);
  const mode = MODES[active];

  return (
    <section className="border-t hairline" aria-labelledby="experience-console-title">
      <div className="mx-auto grid max-w-(--container-content) gap-12 px-(--spacing-gutter) py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">how we engage</p>
          <h2 id="experience-console-title" className="mt-6 text-(length:--text-step-4) leading-[1.02]">
            Advisory with a production heartbeat.
          </h2>
          <p className="mt-6 max-w-xl text-ice">
            Every engagement runs as one visible system — decisions, delivery,
            controls and proof moving together instead of disappearing into
            separate workstreams.
          </p>

          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Engagement layer">
            {MODES.map((item, i) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls="experience-console-panel"
                onClick={() => setActive(i)}
                className={`border px-4 py-3 font-mono text-(length:--text-label) uppercase tracking-[0.08em] transition-[border-color,color,background] duration-(--duration-fast) ease-(--ease-out-expo) ${
                  active === i
                    ? "border-signal bg-signal/10 text-paper"
                    : "hairline text-steel hover:border-signal/60 hover:text-paper"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div
            id="experience-console-panel"
            role="tabpanel"
            className="flex h-full flex-col justify-between border hairline p-8 md:p-12"
          >
            <div>
              <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">
                {mode.n} — {mode.label}
              </p>
              <h3 className="mt-5 text-(length:--text-step-3) leading-[1.05]">{mode.title}</h3>
              <p className="mt-5 max-w-xl leading-relaxed text-ice">{mode.body}</p>
            </div>

            <ul className="mt-10 divide-y divide-ice/12 border-t hairline">
              {mode.points.map((point) => (
                <li key={point} className="flex items-baseline gap-4 py-4">
                  <span aria-hidden className="h-px w-6 shrink-0 translate-y-[-3px] bg-signal" />
                  <span className="text-(length:--text-body-sm) text-glass">{point}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8">
              <Link
                href="/services"
                className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal"
              >
                See the four focus areas →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
