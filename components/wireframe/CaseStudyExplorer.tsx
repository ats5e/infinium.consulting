"use client";

import { useMemo, useState } from "react";
import { CASE_STUDIES } from "@/lib/content";
import { CaseStudyCard } from "@/components/wireframe/Primitives";

/*
 * The wireframe's interactive case-study filters (Service / Sector /
 * Location) with its empty state, rendered with the design system's form
 * styling. Options come from the wireframe filter spec.
 */

const FILTERS: Array<{ key: "service" | "sector" | "location"; label: string; options: string[] }> = [
  {
    key: "service",
    label: "Service",
    options: ["All", "Strategy and Change", "Transformation", "Digital & Automation", "Data & AI", "Regulation and Compliance", "Sustainable Finance"],
  },
  { key: "sector", label: "Sector", options: ["All", "Banks", "Financial Markets", "Insurers", "Fintechs"] },
  { key: "location", label: "Location", options: ["All", "Amsterdam", "Dubai"] },
];

const selectCls =
  "mt-2 w-full border hairline bg-abyss/50 px-3 py-2.5 text-(length:--text-body-sm) text-glass transition-[border-color] duration-(--duration-fast) focus:border-signal focus:outline-none";

export function CaseStudyExplorer() {
  const [filters, setFilters] = useState<Record<string, string>>({
    service: "All",
    sector: "All",
    location: "All",
  });

  const studies = useMemo(
    () =>
      CASE_STUDIES.filter((c) =>
        (Object.keys(filters) as Array<"service" | "sector" | "location">).every(
          (key) => filters[key] === "All" || c[key] === filters[key]
        )
      ),
    [filters]
  );

  return (
    <>
      <div className="mb-8 grid gap-3 md:grid-cols-3">
        {FILTERS.map((f) => (
          <label key={f.key} className="border hairline p-4">
            <span className="eyebrow text-signal">{f.label}</span>
            <select
              className={selectCls}
              value={filters[f.key]}
              onChange={(e) => setFilters((prev) => ({ ...prev, [f.key]: e.target.value }))}
            >
              {f.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      {studies.length ? (
        <div className="grid gap-px md:grid-cols-3" aria-live="polite">
          {studies.map((c) => (
            <CaseStudyCard key={c.slug} c={c} />
          ))}
        </div>
      ) : (
        <p aria-live="polite" className="grid min-h-40 place-items-center border hairline bg-abyss/25 p-8 text-center text-ice">
          No case studies match this combination of filters yet.
        </p>
      )}
    </>
  );
}
