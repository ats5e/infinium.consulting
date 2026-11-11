import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { CaseStudy } from "@/lib/content";

/* the one button: a cobalt pill with the arrow carried in a white disc.
 * "inverse" is the same pill for cobalt or deep grounds. */
export function ArrowDisc({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-transform duration-(--duration-base) ease-(--ease-editorial) group-hover/pill:translate-x-0.5 motion-reduce:transition-none ${
        inverse ? "bg-cobalt text-white" : "bg-white text-cobalt"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7h10M8 3l4 4-4 4" />
      </svg>
    </span>
  );
}

/* shared by PrimaryLink and the form submit buttons */
export function pillClass(inverse = false) {
  return `group/pill inline-flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-[22px] pr-1.5 text-[15px] font-medium tracking-[-0.005em] transition-colors duration-(--duration-fast) ease-(--ease-out-expo) disabled:cursor-not-allowed disabled:opacity-50 ${
    inverse ? "bg-white text-paper hover:bg-tint-deep focus-visible:outline-white" : "bg-cobalt text-white hover:bg-navy"
  }`;
}

export function PrimaryLink({
  href,
  children,
  inverse = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={`${pillClass(inverse)} ${className}`}>
      {/* the disc carries the arrow — strip any "→" left in older labels */}
      {typeof children === "string" ? children.replace(/\s*[→↗]\s*$/, "") : children}
      <ArrowDisc inverse={inverse} />
    </Link>
  );
}

/* the one secondary action: a plain text link */
export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="link-wipe text-[15px] font-medium text-paper transition-colors duration-(--duration-fast) hover:text-cobalt"
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
    <section className="relative pb-16 pt-36 md:pb-24 md:pt-48">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
        {backHref && backLabel ? (
          <Link href={backHref} className="link-wipe mb-10 inline-block text-[15px] font-medium text-steel transition-colors hover:text-cobalt">
            <span aria-hidden>← </span>
            {backLabel}
          </Link>
        ) : null}
        <Reveal>
          {brand ? <div className="mb-8 flex min-h-8 items-center">{brand}</div> : null}
          <p className="eyebrow text-signal">{eyebrow}</p>
          <h1
            className={`mt-7 max-w-5xl leading-[1] tracking-[-0.03em] ${
              longTitle ? "text-[clamp(2.5rem,4.6vw,4.25rem)]" : "text-[clamp(2.75rem,6vw,5.5rem)]"
            }`}
          >
            {title}
          </h1>
          <p className="mt-9 max-w-2xl text-[clamp(1.125rem,1.45vw,1.3rem)] leading-[1.45] text-ice">{body}</p>
          {actions?.length ? (
            <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-4">
              {actions.map((action, i) =>
                action.secondary || i > 0 ? (
                  <SecondaryLink key={`${action.href}-${action.label}`} href={action.href}>
                    {action.label}
                  </SecondaryLink>
                ) : (
                  <PrimaryLink key={`${action.href}-${action.label}`} href={action.href}>
                    {action.label}
                  </PrimaryLink>
                )
              )}
            </div>
          ) : null}
        </Reveal>
        {stats?.length ? <StatGrid stats={stats} className="mt-16 md:mt-20" /> : null}
      </div>
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
    stats.length >= 4 ? "md:grid-cols-4" : stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <Reveal className={`grid grid-cols-2 gap-x-6 gap-y-10 border-t border-paper/14 pt-10 ${colClass} ${className}`}>
      {stats.map((stat) => (
        /* two subgrid rows: values share a baseline, labels share a line */
        <div key={`${stat.value}-${stat.label}`} className="row-span-2 grid grid-rows-subgrid gap-y-3">
          <p className="self-end font-hero text-[clamp(2.25rem,3.6vw,3.25rem)] font-light leading-none tracking-[-0.035em] text-paper">{stat.value}</p>
          <p className="self-start text-[13px] font-medium uppercase tracking-[0.08em] text-steel">{stat.label}</p>
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
  /* a node, not a string — headings that name the product carry the
     <QBricksWord /> wordmark rather than plain type */
  title: React.ReactNode;
  body?: string;
}) {
  return (
    <Reveal className="mb-12 max-w-4xl md:mb-14">
      {eyebrow ? <p className="eyebrow text-signal">{eyebrow}</p> : null}
      <h2 className="mt-6 text-(length:--text-display-2) leading-[1.04] tracking-[-0.02em]">{title}</h2>
      {body ? <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ice">{body}</p> : null}
    </Reveal>
  );
}

export function ContentSection({
  children,
  className = "",
  density = "standard",
  tone = "plain",
}: {
  children: React.ReactNode;
  className?: string;
  density?: "compact" | "standard" | "feature";
  /* sections separate by tone and space, never by a rule */
  tone?: "plain" | "tint";
}) {
  const spacing =
    density === "compact"
      ? "py-14 md:py-20"
      : density === "feature"
        ? "py-24 md:py-32"
        : "py-20 md:py-28";

  return (
    <section className={`${tone === "tint" ? "bg-tint" : ""} ${className}`}>
      <div className={`mx-auto max-w-(--container-content) px-(--spacing-gutter) ${spacing}`}>{children}</div>
    </section>
  );
}

/* one card surface for the whole site: rounded, tonal, no border or shadow */
const CARD =
  "relative block h-full overflow-hidden rounded-2xl bg-white outline-none transition-colors duration-(--duration-base) ease-(--ease-out-expo) focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void";
const CARD_LINK = "group hover:bg-tint-deep focus-visible:bg-tint-deep";
const CARD_CTA = "mt-7 text-[15px] font-medium text-paper transition-colors duration-(--duration-fast) group-hover:text-cobalt";

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
      ? "md:grid-cols-2 lg:grid-cols-4"
      : columns === 3
        ? "md:grid-cols-3"
        : columns === 2
          ? "md:grid-cols-2"
          : "grid-cols-1";
  return (
    <Reveal className={`grid gap-4 ${colClass}`}>
      {items.map((item, i) => {
        const itemSpan = fiveItemLayout ? (i < 3 ? "md:col-span-2" : "md:col-span-3") : "";
        const content = (
          <>
            <p className="text-sm tabular-nums text-steel">{item.num ?? `0${i + 1}`}</p>
            <h3 className={`${compact ? "mt-4" : "mt-8"} text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2]`}>{item.title}</h3>
            <p className={`${compact ? "mt-2" : "mt-4"} text-[15px] leading-relaxed text-ice`}>{item.body}</p>
            {item.cta ? <p className={CARD_CTA}>{item.cta}</p> : null}
          </>
        );
        const className = `${CARD} ${item.href ? CARD_LINK : ""} ${itemSpan} ${compact ? "p-6" : "p-8 md:p-9"}`;

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
  /* five items in three columns leaves a hole — keep every card the same
     width and centre the two-card final row instead (6-col grid, span 2,
     the fourth card starts at track 2) */
  const fiveItemLayout = columns === 3 && items.length === 5;
  const colClass = fiveItemLayout ? "md:grid-cols-6" : columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <Reveal className={`grid gap-4 ${colClass}`}>
      {items.map((item, i) => {
        const itemSpan = fiveItemLayout ? `md:col-span-2 ${i === 3 ? "md:col-start-2" : ""}` : "";
        const inner = (
          <>
            {item.eyebrow ? <p className="eyebrow text-signal">{item.eyebrow}</p> : null}
            {item.logo}
            <h3 className={item.logo ? "sr-only" : "mt-5 text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2]"}>{item.title}</h3>
            <p className={`${item.logo ? "mt-6" : "mt-4"} text-[15px] leading-relaxed text-ice`}>{item.body}</p>
            {item.cta ? <p className={CARD_CTA}>{item.cta}</p> : null}
          </>
        );
        const cls = `${CARD} ${item.href ? CARD_LINK : ""} p-8 md:p-9 ${itemSpan}`;
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
  label = "Speak to an expert",
}: {
  title: string;
  body?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="relative">
      <Reveal className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20 md:py-28">
        {/* Navy: the brand's "deep brand / dark fills" colour (BRAND.md §2);
            cobalt stays the accent for the button, never a large fill */}
        <div className="rounded-3xl bg-navy px-8 py-12 md:px-20 md:py-24">
          <p className="eyebrow text-white/85">next move</p>
          <h2 className="mt-5 max-w-3xl text-(length:--text-display-1) leading-[1.04] tracking-[-0.025em] text-white">{title}</h2>
          {body ? <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/85">{body}</p> : null}
          <PrimaryLink href={href} inverse className="mt-12">
            {label}
          </PrimaryLink>
        </div>
      </Reveal>
    </section>
  );
}

export function CaseStudyCard({ c }: { c: CaseStudy }) {
  const stat = c.stats[0];
  return (
    <Link
      href={`/insights/${c.slug}`}
      data-testid="case-study-card"
      className={`${CARD} ${CARD_LINK} flex flex-col`}
    >
      <picture className="block aspect-[16/9] overflow-hidden">
        <source
          type="image/avif"
          srcSet={`${c.image().avifMob} 800w, ${c.image().avifHalf} ${Math.round(c.image().width / 2)}w`}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
        <img
          src={c.image().webpHalf}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-editorial) group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      </picture>
      <div className="flex flex-1 flex-col p-8">
        <p className="eyebrow text-signal">{c.service} · {c.sector}</p>
        {stat ? (
          <p className="mt-6 font-hero text-[clamp(2rem,2.6vw,2.5rem)] font-light leading-none tracking-[-0.03em] text-paper">{stat.value}</p>
        ) : null}
        <h3 className="mt-5 font-body text-[17px] leading-[1.4] tracking-[-0.01em]">{c.title}</h3>
        <p className={`${CARD_CTA} mt-auto pt-7`}>
          <span aria-hidden>↳ </span>Read the case
        </p>
      </div>
    </Link>
  );
}
