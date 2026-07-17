import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/lib/content";

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,color,transform,box-shadow] duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)] active:translate-y-px"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal transition-colors duration-(--duration-fast) hover:text-navy"
    >
      {children}
    </Link>
  );
}

export function HeroSection({
  eyebrow,
  title,
  body,
  brand,
  actions,
  stats,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  brand?: React.ReactNode;
  actions?: Array<{ href: string; label: string; secondary?: boolean }>;
  stats?: Array<{ value: string; label: string }>;
  backHref?: string;
  backLabel?: string;
}) {
  const longTitle = title.length > 55;

  return (
    <section className="relative overflow-hidden pb-20 pt-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(35,79,189,0.08),transparent_30rem)]" />
      <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter)">
        {backHref && backLabel ? (
          <Link href={backHref} className="link-wipe mb-8 inline-block font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors hover:text-signal">
            ← {backLabel}
          </Link>
        ) : null}
        <Reveal>
          {brand ? <div className="mb-8 flex min-h-8 items-center">{brand}</div> : null}
          <p className="eyebrow text-signal">{eyebrow}</p>
          <h1
            className={`mt-6 max-w-5xl leading-[1.02] ${
              longTitle
                ? "text-(length:--text-step-4) md:text-(length:--text-step-5)"
                : "text-(length:--text-step-5)"
            }`}
          >
            {title}
          </h1>
          <p className="mt-8 max-w-3xl text-(length:--text-step-1) leading-normal text-ice">{body}</p>
          {actions?.length ? (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {actions.map((action, i) =>
                action.secondary || i > 0 ? (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className="inline-flex min-h-11 items-center border hairline bg-white/70 px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper shadow-[0_4px_14px_rgba(23,56,102,0.05)] transition-colors duration-(--duration-fast) hover:border-signal hover:bg-signal hover:text-white"
                  >
                    {action.label}
                  </Link>
                ) : (
                  <PrimaryLink key={`${action.href}-${action.label}`} href={action.href}>
                    {action.label}
                  </PrimaryLink>
                )
              )}
            </div>
          ) : null}
        </Reveal>
        {stats?.length ? <StatGrid stats={stats} className="mt-14" /> : null}
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ice/12" />
    </section>
  );
}

export function StatGrid({
  stats,
  className = "",
}: {
  stats: Array<{ value: string; label: string }>;
  className?: string;
}) {
  const colClass =
    stats.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : stats.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";
  return (
    <Reveal className={`grid gap-px ${colClass} ${className}`}>
      {stats.map((stat) => (
        <div key={`${stat.value}-${stat.label}`} className="border hairline bg-surface/80 p-6 shadow-[0_8px_24px_rgba(23,56,102,0.045)] backdrop-blur-sm">
          <p className="font-display text-(length:--text-step-3) font-medium text-paper">{stat.value}</p>
          <p className="eyebrow mt-3">{stat.label}</p>
        </div>
      ))}
    </Reveal>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <Reveal className="mb-10 max-w-4xl">
      {eyebrow ? <p className="eyebrow text-signal">{eyebrow}</p> : null}
      <h2 className="mt-5 text-(length:--text-step-3) leading-[1.03]">{title}</h2>
      {body ? <p className="mt-5 max-w-3xl leading-relaxed text-ice">{body}</p> : null}
    </Reveal>
  );
}

export function ContentSection({
  children,
  className = "",
  density = "standard",
}: {
  children: React.ReactNode;
  className?: string;
  density?: "compact" | "standard" | "feature";
}) {
  const spacing =
    density === "compact"
      ? "py-14 md:py-16"
      : density === "feature"
        ? "py-24 md:py-28"
        : "py-20";

  return (
    <section className={`border-t hairline ${className}`}>
      <div className={`mx-auto max-w-(--container-content) px-(--spacing-gutter) ${spacing}`}>{children}</div>
    </section>
  );
}

export function NumberedCards({
  items,
  columns = 3,
  compact = false,
}: {
  items: Array<{ title: string; body: string; num?: string; href?: string; cta?: string }>;
  columns?: 1 | 2 | 3 | 4;
  compact?: boolean;
}) {
  const fiveItemLayout = columns === 3 && items.length === 5;
  const colClass =
    fiveItemLayout
      ? "md:grid-cols-6"
      : columns === 4
      ? "lg:grid-cols-4"
      : columns === 3
        ? "md:grid-cols-3"
        : columns === 2
          ? "md:grid-cols-2"
          : "grid-cols-1";
  return (
    <Reveal className={`grid gap-px ${colClass}`}>
      {items.map((item, i) => {
        const itemSpan = fiveItemLayout
          ? i < 3
            ? "md:col-span-2"
            : "md:col-span-3"
          : "";
        const content = (
          <>
            {item.href ? <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" /> : null}
            <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.num ?? `0${i + 1}`}</p>
            <h3 className={`${compact ? "mt-3" : "mt-6"} text-(length:--text-step-1) leading-tight`}>{item.title}</h3>
            <p className={`${compact ? "mt-2" : "mt-4"} text-(length:--text-body-sm) leading-relaxed text-ice`}>{item.body}</p>
            {item.cta ? <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.cta}</p> : null}
          </>
        );
        const className = `${item.href ? "spot group hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_34px_rgba(23,56,102,0.075)] focus-visible:border-signal/60 focus-visible:bg-white" : ""} relative block h-full overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)] outline-none transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) ${itemSpan} ${compact ? "p-5" : "p-7"}`;

        return item.href ? (
          <Link key={`${item.num ?? i}-${item.title}`} href={item.href} className={className}>
            {content}
          </Link>
        ) : (
          <article key={`${item.num ?? i}-${item.title}`} className={className}>
            {content}
          </article>
        );
      })}
    </Reveal>
  );
}

export function CardGrid({
  items,
  columns = 3,
}: {
  items: Array<{ title: string; body: string; eyebrow?: string; logo?: React.ReactNode; href?: string; cta?: string }>;
  columns?: 2 | 3;
}) {
  const colClass = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Reveal className={`grid gap-px ${colClass}`}>
      {items.map((item) => {
        const inner = (
          <>
            {item.eyebrow ? <p className="eyebrow text-signal">{item.eyebrow}</p> : null}
            {item.logo}
            <h3 className={item.logo ? "sr-only" : "mt-4 text-(length:--text-step-1) leading-tight"}>{item.title}</h3>
            <p className={`${item.logo ? "mt-5" : "mt-4"} text-(length:--text-body-sm) leading-relaxed text-ice`}>{item.body}</p>
            {item.cta ? <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.cta}</p> : null}
          </>
        );
        const cls = `${item.href ? "spot group hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_34px_rgba(23,56,102,0.075)] focus-visible:border-signal/60 focus-visible:bg-white" : ""} relative block h-full overflow-hidden border hairline bg-surface/82 p-7 shadow-[0_8px_24px_rgba(23,56,102,0.04)] outline-none transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo)`;
        return item.href ? (
          <Link key={item.title} href={item.href} className={cls}>
            <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            {inner}
          </Link>
        ) : (
          <article key={item.title} className={cls}>
            {inner}
          </article>
        );
      })}
    </Reveal>
  );
}

export function CTASection({
  title,
  body,
  href = "/contact",
  label = "Start a conversation",
}: {
  title: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t hairline">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(35,79,189,0.09),transparent_26rem)]" />
      <Reveal className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) py-24">
        <div className="relative overflow-hidden border hairline bg-surface/88 p-8 shadow-[0_18px_48px_rgba(23,56,102,0.075)] backdrop-blur-xl md:p-12">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
          <p className="eyebrow text-signal">next move</p>
          <h2 className="mt-5 max-w-4xl text-(length:--text-step-4) leading-[1.02]">{title}</h2>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            {body ? <p className="max-w-xl text-ice">{body}</p> : <span />}
            <PrimaryLink href={href}>{label}</PrimaryLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function CaseStudyCard({ c }: { c: CaseStudy }) {
  return (
    <Link
      href={`/insights/${c.slug}`}
      data-testid="case-study-card"
      className="spot group block overflow-hidden border hairline bg-surface/85 shadow-[0_8px_24px_rgba(23,56,102,0.045)] outline-none transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_36px_rgba(23,56,102,0.085)] focus-visible:border-signal/60 focus-visible:bg-white"
    >
      <picture className="block aspect-[16/9] overflow-hidden">
        <source
          type="image/avif"
          srcSet={`${c.image().avifMob} 800w, ${c.image().avifHalf} ${Math.round(c.image().width / 2)}w`}
          sizes="(min-width: 768px) 30vw, 100vw"
        />
        <img
          src={c.image().webpHalf}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-90 saturate-[0.94] contrast-[1.03] transition-[opacity,transform,filter] duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.015] group-hover:opacity-100 group-hover:saturate-100"
        />
      </picture>
      <div className="p-7">
        <p className="eyebrow text-signal">{c.service} · {c.sector}</p>
        <h3 className="mt-4 text-(length:--text-step-1) leading-tight">{c.title}</h3>
        <p className="mt-5 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Read →</p>
      </div>
    </Link>
  );
}
