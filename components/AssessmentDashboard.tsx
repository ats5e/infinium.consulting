"use client";

import { useEffect, useState } from "react";
import { Counter } from "@/components/motion/Counter";

/*
 * THE ASSESSMENT DASHBOARD, rebuilt in the house language.
 *
 * The client supplied a Power BI screenshot of the live maturity-
 * assessment tool (David Aston, 31 Jul 2026). Rather than embedding a
 * raster of another product's chrome, this recreates its Overview —
 * scores per focus area, staff progress, capability by role — as an
 * interactive, on-brand figure: pick a focus area in the rail and the
 * panel switches to its topic-level scores.
 *
 * Figures mirror the illustrative dataset in the supplied screenshot
 * (client "infinium", 10 staff assessed) — the caption below the
 * component says so. Rings and bars animate via CSS transitions;
 * reduced motion lands on the final state immediately.
 */

type Area = {
  key: string;
  label: string;
  short: string;
  score: number;
  topics: Array<[string, number]>;
};

const AREAS: Area[] = [
  {
    key: "delivery",
    label: "Project Delivery",
    short: "Delivery",
    score: 66,
    topics: [
      ["Methodology & cadence", 74],
      ["Backlog & scope management", 70],
      ["Estimation accuracy", 66],
      ["Environment & release management", 62],
      ["Handover into run", 58],
    ],
  },
  {
    key: "testing",
    label: "Testing",
    short: "Testing",
    score: 61,
    topics: [
      ["Entity-resolution quality measurement", 70],
      ["Scenario & score validation", 66],
      ["Regression coverage", 60],
      ["Performance & volume testing", 56],
      ["Test automation", 53],
    ],
  },
  {
    key: "resource",
    label: "Resource Capability",
    short: "Resourcing",
    score: 56,
    topics: [
      ["Role coverage", 66],
      ["Certification depth", 60],
      ["Key-person risk", 54],
      ["Knowledge transfer", 50],
      ["Partner / permanent balance", 48],
    ],
  },
  {
    key: "platform",
    label: "Platform Solution",
    short: "Platform",
    score: 60,
    topics: [
      ["Environment architecture", 72],
      ["Entity resolution design", 64],
      ["Data model & source onboarding", 58],
      ["Scoring logic", 55],
      ["Design standards", 51],
    ],
  },
];

const STATUS = [
  [10, "Staff assessed"],
  [4, "Not started"],
  [2, "In progress"],
  [6, "Completed"],
  [1, "Unassigned"],
] as const;

const ROLES: Array<[string, number]> = [
  ["Architect", 2],
  ["Project Manager", 2],
  ["Business Analyst", 1],
  ["Developer", 1],
  ["Product Owner", 1],
  ["Technical Lead", 1],
  ["Test Lead", 1],
  ["Unassigned", 1],
];

/* a score ring: SVG arc that sweeps in once mounted */
function ScoreRing({ score, label, active }: { score: number; label: string; active?: boolean }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const R = 30;
  const C = 2 * Math.PI * R;
  const off = drawn ? C * (1 - score / 100) : C;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden className="-rotate-90">
          <circle cx="44" cy="44" r={R} fill="none" strokeWidth="7" className="stroke-navy/10" />
          <circle
            cx="44"
            cy="44"
            r={R}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={off}
            className={`${active ? "stroke-cobalt" : "stroke-signal/70"} motion-safe:transition-[stroke-dashoffset] motion-safe:duration-[1100ms] motion-safe:ease-(--ease-out-expo)`}
          />
        </svg>
        <p className="absolute inset-0 flex items-center justify-center font-display text-(length:--text-step-1) font-medium text-paper">
          <Counter value={score} suffix="%" />
        </p>
      </div>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-steel">{label}</p>
    </div>
  );
}

/* a topic bar: fills to its score once mounted; `display` overrides the
 * printed value when the bar width and the real figure use different scales */
function TopicBar({ label, score, display }: { label: string; score: number; display?: string }) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-12">
      <p className="text-(length:--text-body-sm) leading-snug text-glass sm:col-span-5">{label}</p>
      <div className="flex items-center gap-3 sm:col-span-7">
        <div className="h-2 grow overflow-hidden rounded-full bg-navy/8">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cobalt to-signal motion-safe:transition-[width] motion-safe:duration-[900ms] motion-safe:ease-(--ease-out-expo)"
            style={{ width: drawn ? `${score}%` : "0%" }}
          />
        </div>
        <p className="w-10 shrink-0 text-right font-mono text-(length:--text-label) tabular-nums text-paper">{display ?? score}</p>
      </div>
    </div>
  );
}

export function AssessmentDashboard() {
  const [tab, setTab] = useState<string>("overview");
  const area = AREAS.find((a) => a.key === tab);
  const tabs = [{ key: "overview", label: "Overview", short: "Overview" }, ...AREAS];

  return (
    <figure className="overflow-hidden border hairline bg-white/85 shadow-[0_20px_54px_rgba(23,56,102,0.09)]">
      {/* the tool's chrome: title row with the run's live meta */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b hairline bg-abyss/25 px-5 py-4 sm:px-7">
        <p className="font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-paper">
          Maturity assessment <span aria-hidden className="mx-2 text-steel/60">/</span>
          <span className="text-signal">{area?.label ?? "Overview"}</span>
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel">Client: illustrative · 750+ questions · 4 focus areas</p>
      </div>

      <div className="grid md:grid-cols-12">
        {/* the rail */}
        <div
          role="tablist"
          aria-label="Assessment views"
          aria-orientation="vertical"
          className="flex gap-px overflow-x-auto border-b hairline bg-abyss/15 p-2 md:col-span-3 md:flex-col md:justify-start md:border-b-0 md:border-r md:p-3"
        >
          {tabs.map((t) => {
            const selected = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(t.key)}
                className={`shrink-0 px-4 py-2.5 text-left font-mono text-(length:--text-label) uppercase tracking-[0.08em] outline-none transition-colors duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-signal md:w-full ${
                  selected
                    ? "bg-cobalt text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)]"
                    : "text-steel hover:bg-white/70 hover:text-paper"
                }`}
              >
                <span className="md:hidden">{t.short}</span>
                <span className="hidden md:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* the panel */}
        <div className="p-5 sm:p-7 md:col-span-9">
          {tab === "overview" ? (
            <div key="overview">
              <div className="grid grid-cols-2 gap-px sm:grid-cols-5">
                {STATUS.map(([n, label]) => (
                  <div key={label} className="border hairline bg-surface/80 px-4 py-3">
                    <p className="font-display text-(length:--text-step-2) leading-none text-paper"><Counter value={n} /></p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-steel">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {AREAS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => setTab(a.key)}
                    className="group rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
                    aria-label={`Open ${a.label}: scored ${a.score} percent`}
                  >
                    <ScoreRing score={a.score} label={a.label} />
                    <p className="mt-1 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-signal opacity-0 transition-opacity duration-(--duration-fast) group-hover:opacity-100 group-focus-visible:opacity-100">
                      View detail →
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-8 border-t hairline pt-6">
                <p className="eyebrow text-steel">Capability by role</p>
                <div className="mt-4 space-y-3">
                  {ROLES.map(([role, n]) => (
                    <TopicBar key={role} label={role} score={n * 10} display={String(n)} />
                  ))}
                </div>
              </div>
            </div>
          ) : area ? (
            <div key={area.key}>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="eyebrow text-signal">Focus area</p>
                  <h3 className="mt-2 text-(length:--text-step-2) leading-tight">{area.label}</h3>
                  <p className="mt-3 max-w-md text-(length:--text-body-sm) leading-relaxed text-ice">
                    Topic-level scores against the reference model of high-performing Quantexa implementations.
                  </p>
                </div>
                <ScoreRing score={area.score} label="Area score" active />
              </div>
              <div className="mt-8 space-y-4 border-t hairline pt-6">
                {area.topics.map(([label, score]) => (
                  <TopicBar key={label} label={label} score={score} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <figcaption className="eyebrow border-t hairline p-4">
        The live scoring dashboard behind the assessment, recreated with illustrative data — every answer, score and gap tracked by focus area and role
      </figcaption>
    </figure>
  );
}
