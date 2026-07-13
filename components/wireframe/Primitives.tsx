import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/lib/content";

export function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal"
    >
      {children}
    </Link>
  );
}

export function HeroSection({
  eyebrow,
  title,
  body,
  actions,
  stats,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: Array<{ href: string; label: string; secondary?: boolean }>;
  stats?: Array<{ value: string; label: string }>;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-20 pt-40">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(115,168,251,0.18),transparent_30rem)]" />
      <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter)">
        {backHref && backLabel ? (
          <Link href={backHref} className="link-wipe mb-8 inline-block font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors hover:text-paper">
            ← {backLabel}
          </Link>
        ) : null}
        <Reveal>
          <p className="eyebrow text-signal">{eyebrow}</p>
          <h1 className="mt-6 max-w-5xl text-(length:--text-step-5) leading-[1.02]">{title}</h1>
          <p className="mt-8 max-w-3xl text-(length:--text-step-1) leading-normal text-ice">{body}</p>
          {actions?.length ? (
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {actions.map((action, i) =>
                action.secondary || i > 0 ? (
                  <Link
                    key={`${action.href}-${action.label}`}
                    href={action.href}
                    className="inline-flex min-h-11 items-center border hairline px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) hover:border-signal hover:bg-signal hover:text-void"
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
        <div key={`${stat.value}-${stat.label}`} className="border hairline bg-abyss/35 p-6 backdrop-blur-sm">
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
      <h2 className="mt-5 text-(length:--text-step-3) leading-[1.06]">{title}</h2>
      {body ? <p className="mt-5 max-w-3xl leading-relaxed text-ice">{body}</p> : null}
    </Reveal>
  );
}

export function ContentSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t hairline ${className}`}>
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">{children}</div>
    </section>
  );
}

export function NumberedCards({
  items,
  columns = 3,
}: {
  items: Array<{ title: string; body: string; num?: string }>;
  columns?: 2 | 3 | 4;
}) {
  const colClass = columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Reveal className={`grid gap-px ${colClass}`}>
      {items.map((item, i) => (
        <article key={`${item.num ?? i}-${item.title}`} className="group relative border hairline bg-abyss/25 p-7 transition-[border-color,transform,background] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-signal/60 hover:bg-abyss/50">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal shadow-[0_0_20px_var(--color-signal)] transition-transform duration-(--duration-base) group-hover:scale-x-100" />
          <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.num ?? `0${i + 1}`}</p>
          <h3 className="mt-6 text-(length:--text-step-1) leading-tight">{item.title}</h3>
          <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{item.body}</p>
        </article>
      ))}
    </Reveal>
  );
}

export function CardGrid({
  items,
  columns = 3,
}: {
  items: Array<{ title: string; body: string; eyebrow?: string; href?: string; cta?: string }>;
  columns?: 2 | 3;
}) {
  const colClass = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Reveal className={`grid gap-px ${colClass}`}>
      {items.map((item) => {
        const inner = (
          <>
            {item.eyebrow ? <p className="eyebrow text-signal">{item.eyebrow}</p> : null}
            <h3 className="mt-4 text-(length:--text-step-1) leading-tight">{item.title}</h3>
            <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{item.body}</p>
            {item.cta ? <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.cta}</p> : null}
          </>
        );
        const cls = "group block h-full border hairline bg-abyss/25 p-7 transition-[border-color,transform,background] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-signal/60 hover:bg-abyss/50";
        return item.href ? (
          <Link key={item.title} href={item.href} className={cls}>
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
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(115,168,251,0.20),transparent_26rem)]" />
      <Reveal className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) py-24">
        <div className="overflow-hidden border hairline bg-abyss/45 p-8 backdrop-blur-xl md:p-12">
          <p className="eyebrow text-signal">next move</p>
          <h2 className="mt-5 max-w-4xl text-(length:--text-step-4) leading-[1.03]">{title}</h2>
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
      className="group block overflow-hidden border hairline bg-abyss/25 transition-[border-color,transform,background] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-signal/60 hover:bg-abyss/50"
    >
      <picture aria-hidden className="block aspect-[16/9] overflow-hidden">
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
          className="h-full w-full object-cover opacity-70 transition-[opacity,transform] duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.03] group-hover:opacity-90"
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
