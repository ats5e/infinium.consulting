import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { GlassImage } from "@/components/GlassImage";
import { Hero } from "@/components/hero/Hero";
import { PartnerLogos, TechnologyLogo } from "@/components/PartnerLogos";
import { QBricksWord } from "@/components/QBricksWord";
import { DubaiOfficeVideo, NetherlandsOfficeVideo, QBricksFilm, QuantexaFilm } from "@/components/OfficeVideo";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { PhotoCollage, type CollageShot } from "@/components/PhotoCollage";
import {
  CASE_STUDIES,
  PERSPECTIVES,
  SERVICES,
  SECTORS,
  TECHNOLOGIES,
  caseStudy,
  type CaseStudy,
} from "@/lib/content";
import { siteImage } from "@/lib/images";
import { CaseStudyExplorer } from "@/components/wireframe/CaseStudyExplorer";
import { FactoryLineBand } from "@/components/FactoryLine";
import { AssessmentDashboard } from "@/components/AssessmentDashboard";
import {
  CardGrid,
  CaseStudyCard,
  ContentSection,
  CTASection,
  HeroSection,
  NumberedCards,
  PrimaryLink,
  SectionIntro,
  SecondaryLink,
  StatGrid,
} from "@/components/wireframe/Primitives";

type PageMeta = { title: string; description: string };
type Route = { render: () => React.ReactNode; meta: PageMeta };

type PageImageSlot =
  | "hero"
  | "data-engineering"
  | "data-science"
  | "digital-transformation"
  | "governance"
  | "about-difc"
  | "careers"
  | "qbricks"
  | "tbricks";

function PageImage({
  slot = "hero",
  alt,
}: {
  slot?: PageImageSlot;
  alt: string;
}) {
  return (
    <div className="overflow-hidden border hairline">
      <GlassImage image={siteImage(slot)} alt={alt} sizes="(min-width: 768px) 45vw, 100vw" />
    </div>
  );
}

function CaseStudyVisual({ study }: { study: CaseStudy }) {
  return (
    <Reveal className="grid items-start gap-8 lg:grid-cols-[minmax(13rem,0.3fr)_minmax(0,0.7fr)] lg:gap-12">
      <aside className="lg:sticky lg:top-28">
        <p className="eyebrow text-signal">Project view</p>
        <h2 className="mt-5 max-w-sm text-(length:--text-step-2) leading-[1.08]">
          The system behind the outcome
        </h2>
        <p className="mt-5 max-w-md text-(length:--text-body-sm) leading-relaxed text-ice">
          {study.summary}
        </p>
        <dl className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
          {[
            ["Service", study.service],
            ["Sector", study.sector],
            ["Location", study.location],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[5.5rem_1fr] gap-4 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-steel">
                {label}
              </dt>
              <dd className="text-(length:--text-body-sm) leading-snug text-paper">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <figure
        data-testid="case-study-visual"
        className="mx-auto w-full max-w-[1000px] overflow-hidden border border-navy/14 bg-white shadow-[0_18px_48px_rgba(23,56,102,0.09)]"
      >
        <div className="flex min-h-11 items-center justify-between gap-4 border-b border-navy/10 bg-surface/90 px-4 font-mono text-[9px] uppercase tracking-[0.1em] text-steel sm:px-5">
          <span>Case study / visual evidence</span>
          <span className="hidden text-right sm:block">{study.service}</span>
        </div>
        <div className="relative aspect-[5/3] overflow-hidden bg-[#eef3fa]">
          <GlassImage
            image={study.image()}
            alt={`${study.title} — project illustration`}
            sizes="(min-width: 1280px) 820px, (min-width: 1024px) 66vw, 100vw"
            imageClassName="h-full w-full object-cover contrast-[1.04] saturate-[0.96]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/35"
          />
        </div>
      </figure>
    </Reveal>
  );
}

/* Credential band.
 *
 * Each mark was a separate file except the first four, which shipped as one
 * pre-composed bitmap — fitted by height inside a full-width cell, so it
 * rendered clustered with dead space either side. They are now individual
 * assets extracted from that collage.
 *
 * `h` is a rendered height in px, derived from each mark's aspect ratio so
 * the logos carry roughly equal optical AREA rather than equal height —
 * h ∝ ratio^-0.4, tempered from true equal-area (^-0.5) so wide wordmarks
 * stay legible. Without this, a 3:1 wordmark reads three times heavier than
 * a square seal at the same height.
 */
const AWARDS = [
  { src: "/awards/ecovadis-silver-2024.webp", alt: "EcoVadis Silver sustainability rating, top 15%, September 2024", w: 476, h: 478, height: 76 },
  /* NEN 4400-1 and Stichting Normering Arbeid removed per client (20 Aug):
     compliance registrations, not awards — files kept in public/awards */
  { src: "/awards/best-workplaces-nl-2024.webp", alt: "Great Place To Work — Best Workplaces Netherlands 2024, top 5", w: 454, h: 447, height: 76 },
  // outlined badge with a caption inside it — needs more height to read
  { src: "/awards/Appian.webp", alt: "Appian Europe 2024 Financial Services Partner of the Year", w: 364, h: 200, height: 68 },
  { src: "/awards/Consultancy Awards.png", alt: "The Consultancy Awards 2025", w: 440, h: 364, height: 70 },
  { src: "/awards/Alteryx Partner.png", alt: "Alteryx Partner — Authorized Professional Services", w: 200, h: 232, height: 80 },
  // re-cut with a transparent ground; the supplied file had an opaque white
  // panel that showed as a box against the page tint
  { src: "/awards/quantexa-plus-alliance.png", alt: "Quantexa Plus Alliance Partner", w: 2981, h: 707, height: 44 },
] as const;

const HOME_PILLARS = [
  {
    eyebrow: "What we do",
    title: "Outcomes in weeks, not roadmaps in quarters",
    slot: "digital-transformation" as const,
    body: "Financial services firms trust us to provide market-leading strategy, specialist transformation and AI-enabled automation solutions. We help our clients rapidly deliver business outcomes.",
    cta: "See what we deliver →",
    href: "/services",
  },
  {
    eyebrow: "Who we work with",
    title: "For leaders accountable for transformation",
    // the four cards in this grid hold one art direction: white-ground cobalt
    // abstracts. Architectural photography here broke the set.
    slot: "data-science" as const,
    body: "From Amsterdam and Dubai, we serve the EU, Nordic and Middle East (GCC) markets, across capital markets, banking, insurance, wealth and asset management. Our typical clients are C-suite and senior leaders with a transformation agenda, who are looking to accelerate the business with the use of AI and automation.",
    cta: "Read case studies →",
    href: "/insights",
  },
  {
    eyebrow: "How we do it",
    title: "Delivery that starts on day one",
    slot: "data-engineering" as const,
    body: "Hands-on practitioners pair deep financial services expertise with disciplined, engineering-led delivery. Packaged methodologies, proven patterns and automation mean we start delivering from day one, measurable outcomes, not slideware.",
    cta: "Our services →",
    href: "/services",
  },
  {
    eyebrow: "Our solutions",
    title: "QBricks & VBricks: implementations compressed from years to months",
    // the QBricks red belongs on the product pages, where it reads as brand;
    // beside three cobalt cards it read as a mistake. Layered glass instead.
    slot: "governance" as const,
    body: "Our high-end engineered solutions optimise the delivery value chain end to end: pre-built, proven components that compress implementations from years to months and significantly accelerate return on investment.",
    cta: "Explore QBricks & VBricks →",
    href: "/solutions",
  },
] as const;

/* ---- Home -------------------------------------------------------------- */

export function HomeWirePage() {
  return (
    <>
      <Hero staticImage={siteImage("hero")} />

      {/* the evidence — four facts on one ruled strip, counted up on arrival */}
      <section aria-label="Key figures" className="border-b hairline">
        <Reveal className="mx-auto grid max-w-(--container-content) grid-cols-2 divide-x divide-navy/10 px-(--spacing-gutter) sm:grid-cols-4">
          {([
            [22, "", "Leading global FS clients"],
            [100, "+", "Projects completed"],
            /* David (21 Aug): no count here — "30 is way too broad" */
            ["Best in class", "", "Fintech solution technologies"],
            /* chairman's note: name the hubs rather than count them */
            ["Amsterdam & Dubai", "", "Serving EMEA & MENA"],
          ] as const).map(([value, suffix, label]) => (
            <div key={label} className="px-4 py-8 first:pl-0 sm:px-7 sm:py-10">
              {typeof value === "number" ? (
                <p className="font-display text-(length:--text-step-3) leading-none text-paper">
                  <Counter value={value} suffix={suffix} />
                </p>
              ) : (
                <p className="font-display text-(length:--text-step-2) leading-[1.1] text-paper">{value}</p>
              )}
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-steel">
                {label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <ContentSection className="overflow-hidden" density="compact">
        <h2 className="eyebrow text-center">Recognised for delivery, not decks</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-(length:--text-body-sm) text-ice">
          Partner-of-the-year awards from the platforms our clients run on.
        </p>
        {/* ruled cells, so this band reads as a set with the figures strip
            above it. Each mark keeps its optically-matched height. */}
        {/* flush with the page ground — no tiles, no rules — so the marks
            read as a quiet credential row (client, 20 Aug) */}
        <Reveal className="mt-8 grid grid-cols-2 sm:grid-cols-3">
          {AWARDS.map((award) => (
            <div
              key={award.src}
              className="flex min-h-36 items-center justify-center px-5 py-7 sm:min-h-40"
            >
              <Image
                src={award.src}
                alt={award.alt}
                width={award.w}
                height={award.h}
                loading="lazy"
                sizes="280px"
                style={{ height: `${award.height}px` }}
                className="w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </Reveal>
      </ContentSection>

      <ContentSection density="feature">
        <div className="grid gap-4 md:grid-cols-2">
          {HOME_PILLARS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="spot group relative block overflow-hidden border hairline outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo) hover:border-signal/60 focus-visible:border-signal/60"
            >
              <picture className="absolute inset-0">
                <source
                  type="image/avif"
                  srcSet={`${siteImage(item.slot).avifMob} 800w, ${siteImage(item.slot).avifHalf} ${Math.round(siteImage(item.slot).width / 2)}w`}
                  sizes="(min-width: 768px) 50vw, 66vw"
                />
                <img
                  src={siteImage(item.slot).webpHalf}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.015]"
                  style={{ backgroundImage: `url(${siteImage(item.slot).lqip})`, backgroundSize: "cover" }}
                />
              </picture>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-overlay/96 via-overlay/72 to-overlay/20" />
              <div className="relative flex min-h-[25rem] flex-col justify-end p-7 md:min-h-[28rem]">
                <p className="eyebrow text-on-dark-accent">{item.eyebrow}</p>
                <h2 className="mt-4 text-(length:--text-step-2) leading-tight text-on-dark">{item.title}</h2>
                <p className="mt-5 max-w-xl leading-relaxed text-on-dark-muted">{item.body}</p>
                <p className="mt-7 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-on-dark-accent">{item.cta}</p>
              </div>
            </Link>
          ))}
        </div>
      </ContentSection>

      <ContentSection>
        <SectionIntro eyebrow="Why Infinium" title="What you get that big-brand firms can't give you" />
        <NumberedCards
          columns={3}
          items={[
            { title: "Outcome-focused, not PowerPoint-focused", body: "We are measured on delivered business results — working systems, automated processes, realised savings — not decks and recommendations." },
            { title: "Seasoned practitioners on every engagement", body: "Our team has run the functions you are transforming. We have done it ourselves, so we understand your challenges from the inside." },
            { title: "Senior engineers in your office, not a delivery centre", body: "Highly educated engineering talent that works alongside you and your teams — on-shore, not off-shore — with the quality and pace that proximity brings." },
            { title: "People who've run the function you're transforming", body: "More than 30 years operating across the world's financial centres — capital markets, banking, insurance, wealth and asset management." },
            { title: "Our own solutions, designed to improve efficiency", body: "Pre-built, high-end engineered solutions like QBricks and VBricks that compress implementations from years to months and cut cost of ownership." },
          ]}
        />
      </ContentSection>
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">Research &amp; development</p>
            <h2 className="mt-6 text-(length:--text-step-3)">Products that cut the cost of running your data estate</h2>
            <p className="mt-6 leading-relaxed text-ice">
              Built from real delivery experience in Amsterdam and DIFC, Dubai &mdash; every solution exists to remove manual work, shorten implementations and lower cost of ownership. QBricks is designed and developed in the Netherlands, VBricks in DIFC, Dubai: fewer manual processes, faster implementations, measurable results.
            </p>
            <p className="mt-8 flex flex-wrap gap-6">
              <SecondaryLink href="/solutions">See what we&rsquo;ve built →</SecondaryLink>
              <SecondaryLink href="/about/infinium-labs">Meet Infinium Labs →</SecondaryLink>
            </p>
          </Reveal>
          <PageImage slot="tbricks" alt="Abstract glass engineering structure" />
        </div>
      </ContentSection>

      <ContentSection>
        <SectionIntro
          eyebrow="Case studies"
          title="Four weeks to five minutes: outcomes we've delivered"
          body="Regulatory reporting, entity stand-ups, data strategy — measured results across regulated finance."
        />
        <div className="mb-8"><SecondaryLink href="/insights">View all case studies →</SecondaryLink></div>
        <div className="grid gap-px md:grid-cols-3">
          {CASE_STUDIES.slice(0, 6).map((c) => <CaseStudyCard key={c.slug} c={c} />)}
        </div>
      </ContentSection>



      <CTASection
        title="Pick one outcome. We'll show you the fastest route to it."
        body="A free goals review with a practice lead — you leave with a concrete plan, whether or not you work with us."
        label="Schedule a discussion"
      />
    </>
  );
}

/* ---- Services ---------------------------------------------------------- */

/* action-oriented card CTAs — six identical "Learn more" links read as
 * passive (client review, 20 Aug) */
const SERVICE_CTA: Record<string, string> = {
  "data-and-ai": "Put your data to work →",
  "digital-and-automation": "Automate a process →",
  "regulation-and-compliance": "De-risk your compliance →",
  "strategy-and-change": "Shape the strategy →",
  "sustainable-finance": "Get audit-ready →",
  transformation: "Deliver the change →",
};

const SERVICE_IMAGE: Record<string, Parameters<typeof siteImage>[0]> = {
  "data-and-ai": "data-science",
  "digital-and-automation": "data-engineering",
  "regulation-and-compliance": "governance",
  "strategy-and-change": "strategy-change",
  "sustainable-finance": "sustainable-finance",
  transformation: "digital-transformation",
};

const SERVICE_DETAIL: Record<string, {
  deliverTitle: string;
  deliverBody?: string;
  items: Array<{ title: string; body: string }>;
  links: Array<{ href: string; label: string }>;
  ctaTitle: string;
  ctaBody: string;
}> = {
  "data-and-ai": {
    deliverTitle: "From data foundations to production AI",
    items: [
      { title: "Data engineering & governance", body: "Enterprise data sourced, governed and made trustworthy, lineage, contracts and quality controls that stand up to regulatory scrutiny." },
      { title: "AI from pilots to production", body: "Agentic AI and machine learning deployed responsibly, with the governance, controls and human-in-the-loop patterns regulated firms require." },
      { title: "Decision intelligence", body: "Contextual monitoring and entity resolution at bank scale with Quantexa, for CDD, correspondent banking and financial crime." },
    ],
    links: [
      { href: "/solutions/qbricks", label: "QBricks, governed, A.I.-ready data in hours →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Is your data ready for AI?",
    ctaBody: "Start with our AI assessment, or a discussion with a practice lead.",
  },
  "digital-and-automation": {
    deliverTitle: "Retire the spreadsheet, keep the control",
    items: [
      { title: "Process automation", body: "Governed, auditable workflows replacing spreadsheet-bound processes, reporting cycles cut from weeks to minutes." },
      { title: "Low-code platforms", body: "Case management and customer-lifecycle solutions built on Appian and similar platforms, deployed in months, not years." },
      { title: "Intelligent workflows", body: "Automation enriched with AI, from data validation workflows to agentic processes with human-in-the-loop control." },
    ],
    links: [
      { href: "/technologies", label: "Our technology partners →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Which process costs you the most?",
    ctaBody: "Bring it to a discussion, we'll show you what automation can do with it.",
  },
  "regulation-and-compliance": {
    deliverTitle: "Compliance that stands up to scrutiny",
    items: [
      { title: "Regulatory reporting", body: "Automated, transparent reporting, from transaction reporting to prudential returns, with process times cut from weeks to minutes." },
      { title: "Financial crime", body: "AML, KYC and CDD enhanced with decision intelligence, contextual monitoring that reduces false positives and audit burden." },
      { title: "Controls & model risk", body: "Defensible control frameworks and engineered model testing, credit, KYC, fraud and AML models validated with full evidence trails." },
    ],
    links: [
      { href: "/solutions/vbricks", label: "VBricks, a major change in model testing →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Facing new regulation?",
    ctaBody: "Talk to a practice lead about your regulatory change portfolio.",
  },
  "strategy-and-change": {
    deliverTitle: "Strategy built by people who have executed it",
    items: [
      { title: "Technology & data strategy", body: "Multi-year technology and data strategies shaped in weeks, grounded in what the market's platforms can actually deliver." },
      { title: "Operating model design", body: "Target operating models for new entities, new markets and new products, designed for regulatory approval and real-world execution." },
      { title: "Change delivery", body: "Change portfolios shaped, sequenced and led, with the governance to keep initiatives honest against their business case." },
    ],
    links: [{ href: "/insights", label: "Read the case studies →" }],
    ctaTitle: "What is your strategy?",
    ctaBody: "Start with a free goals review with one of our industry practice leads.",
  },
  "sustainable-finance": {
    deliverTitle: "ESG obligations, delivered like engineering",
    items: [
      { title: "ESG reporting", body: "Group-level ESG reporting solutions delivered in weeks, scalable across business areas and flexible enough to track progress to target." },
      { title: "Climate & sustainable funding", body: "Climate and sustainable funding & finance solutions, engineered for auditability and regulatory alignment from day one." },
      { title: "Regulatory alignment", body: "CSRD, SFDR and evolving disclosure regimes translated into data requirements, controls and reporting your teams can run." },
    ],
    links: [
      { href: "/solutions/esg-reporting", label: "Explore the ESG reporting platform →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Where is your ESG programme today?",
    ctaBody: "Talk to a practice lead about your reporting obligations and timeline.",
  },
  transformation: {
    deliverTitle: "Complex change, delivered by practitioners",
    items: [
      { title: "Programme leadership", body: "MD-level practitioners leading your most complex initiatives, accountable for outcomes, not just plans." },
      { title: "Entity stand-up & restructuring", body: "New entities stood up and businesses restructured across jurisdictions, including the financial markets business of a major UK bank in the Netherlands." },
      { title: "Platform migration", body: "Vendor selection through cut-over and stabilisation, delivery compressed with packaged methodologies and pre-built patterns." },
    ],
    links: [{ href: "/insights", label: "Read the case studies →" }],
    ctaTitle: "A transformation agenda to deliver?",
    ctaBody: "Talk to a practice lead about your portfolio of change initiatives.",
  },
};

export function ServicesWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="What we do"
        title="Our services"
        body="Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services."
      />
      <ContentSection>
        <Reveal className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((service, i) => {
            const img = siteImage(SERVICE_IMAGE[service.slug]);
            const priority = i === 0;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="spot group relative block overflow-hidden border hairline outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo) hover:border-signal/60 focus-visible:border-signal/60"
              >
                <picture className="absolute inset-0">
                  <source
                    type="image/avif"
                    srcSet={`${img.avifMob} 800w, ${img.avifHalf} ${Math.round(img.width / 2)}w`}
                    sizes="(min-width: 768px) 50vw, 66vw"
                  />
                  <img
                    src={img.webpHalf}
                    alt=""
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url(${img.lqip})`, backgroundSize: "cover" }}
                  />
                </picture>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-overlay/96 via-overlay/72 to-overlay/20" />
                <div className="relative flex min-h-80 flex-col justify-end p-8">
                  <p className="eyebrow text-on-dark-accent">{service.eyebrow}</p>
                  <h2 className="mt-4 text-(length:--text-step-2) leading-tight text-on-dark">{service.title}</h2>
                  <p className="mt-4 max-w-xl text-(length:--text-body-sm) leading-relaxed text-on-dark-muted">{service.navBody}</p>
                  <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-on-dark-accent">{SERVICE_CTA[service.slug] ?? "Learn more →"}</p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </ContentSection>
      <CTASection
        title="Not sure where to start?"
        body="We shape strategy and solution options around your goals and challenges."
        label="Schedule a discussion"
      />
    </>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug);
  const detail = SERVICE_DETAIL[slug];
  if (!service || !detail) notFound();
  return (
    <>
      <HeroSection
        eyebrow={`Our services · ${service.category}`}
        title={service.title}
        body={service.lead}
      />
      <ContentSection>
        {/* intro + supporting image as a balanced split — the image is a
            companion to the section, never a billboard */}
        <div className="mb-16 grid gap-10 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <p className="eyebrow text-signal">What we deliver</p>
            <h2 className="mt-6 max-w-2xl text-(length:--text-step-4)">{detail.deliverTitle}</h2>
          </Reveal>
          <div className="md:col-span-5">
            <div className="aspect-[4/3] overflow-hidden border hairline [&_picture]:block [&_picture]:h-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
              <GlassImage
                image={siteImage(SERVICE_IMAGE[slug])}
                alt={service.title}
                sizes="(min-width: 768px) 38vw, 100vw"
              />
            </div>
          </div>
        </div>
        <NumberedCards items={detail.items} />
        <div className="mt-10 flex flex-wrap gap-6">
          {detail.links.map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
      </ContentSection>
      <CTASection title={detail.ctaTitle} body={detail.ctaBody} label="Schedule a discussion" />
    </>
  );
}

/* ---- Solutions --------------------------------------------------------- */

export function SolutionsWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="What we offer"
        title="Our solutions"
        body="Pre-built solutions and assessment tooling that shorten delivery timelines and de-risk your programmes."
      />
      <ContentSection>
        <div className="grid gap-px lg:grid-cols-2">
          <article className="overflow-hidden border hairline bg-abyss/25">
            <div className="border-b hairline"><GlassImage image={siteImage("qbricks")} alt="QBricks — governed data products" sizes="(min-width: 1024px) 45vw, 66vw" priority /></div>
            <div className="p-8">
            <p className="eyebrow text-signal">Solution</p>
            <h2 className="mt-6 text-(length:--text-step-4)"><QBricksWord /> </h2>
            <p className="mt-4 text-(length:--text-step-1) text-glass">No more data pipelines.</p>
            <p className="mt-6 leading-relaxed text-ice">QBricks turns your systems of record into governed, A.I.-ready data products, in hours, not months or years. Governance is enforced by contract (ODCS) at the point of ingestion, agentic metadata works with a human in the loop, and everything runs on local compute in open, portable formats.</p>
            <p className="mt-5 text-ice">Built for financial-crime use cases like AML and KYC. Works with Databricks, Microsoft Fabric, Snowflake or your own database.</p>
            <p className="mt-5 text-ice">Designed and developed by our R&amp;D team in the Netherlands.</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <PrimaryLink href="/solutions/qbricks">Explore QBricks →</PrimaryLink>
              <SecondaryLink href="/contact">Request a demo →</SecondaryLink>
            </div>
            </div>
          </article>
          <article className="overflow-hidden border hairline bg-abyss/25">
            <div className="border-b hairline"><GlassImage image={siteImage("tbricks")} alt="VBricks — engineered model testing" sizes="(min-width: 1024px) 45vw, 66vw" /></div>
            <div className="p-8">
            <p className="eyebrow text-signal">Solution</p>
            <h2 className="mt-6 text-(length:--text-step-4)">VBricks</h2>
            <p className="mt-4 text-(length:--text-step-1) text-glass">A major change in model testing.</p>
            <p className="mt-6 leading-relaxed text-ice">VBricks transforms how financial institutions test and validate their models, credit models, KYC models, fraud and AML models and more. Validation that took weeks of manual effort becomes a repeatable, engineered process: automated test packs, challenger comparisons and full evidence trails, run on demand.</p>
            <p className="mt-5 text-ice">Every run is auditable and defensible, built for model risk management and regulatory scrutiny.</p>
            <p className="mt-5 text-ice">Designed and developed by our R&amp;D team in DIFC, Dubai (UAE).</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ComingSoonPill />
              <SecondaryLink href="/solutions/vbricks">Explore VBricks →</SecondaryLink>
              <SecondaryLink href="/contact">Request a demo →</SecondaryLink>
            </div>
            </div>
          </article>
        </div>
      </ContentSection>
      <ContentSection>
        <Reveal>
          <Link
            href="/solutions/ai-factory"
            className="spot group relative block overflow-hidden border hairline bg-surface/85 p-8 shadow-[0_8px_24px_rgba(23,56,102,0.045)] outline-none transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_36px_rgba(23,56,102,0.085)] focus-visible:border-signal/60 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void md:p-10"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-9">
                <p className="eyebrow text-signal">Packaged offering</p>
                <h2 className="mt-6 text-(length:--text-step-4)">AI Factory</h2>
                <p className="mt-4 text-(length:--text-step-1) text-glass">From AI pilots to an industrial AI capability.</p>
                <p className="mt-6 max-w-3xl leading-relaxed text-ice">One governed capability — data engine, platform, delivery pods and operating model — that serves every use case across the firm. Powered by QBricks and engineered for regulated finance.</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Explore the AI Factory →</p>
              </div>
            </div>
          </Link>
        </Reveal>
        <Reveal className="mt-px">
          <Link
            href="/solutions/esg-reporting"
            className="spot group relative block overflow-hidden border hairline bg-surface/85 p-8 shadow-[0_8px_24px_rgba(23,56,102,0.045)] outline-none transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_36px_rgba(23,56,102,0.085)] focus-visible:border-signal/60 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void md:p-10"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-9">
                <p className="eyebrow text-signal">Platform</p>
                <h2 className="mt-6 text-(length:--text-step-4)">ESG reporting</h2>
                <p className="mt-4 text-(length:--text-step-1) text-glass">Audit-ready ESG disclosure, on one governed platform.</p>
                <p className="mt-6 max-w-3xl leading-relaxed text-ice">A modular, three-hub platform — data sourcing, processing and reporting — aligned to CSRD, CSDDD, GRI and ISSB, and powered by a best-in-class Alteryx data analytics engine.</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Explore ESG reporting →</p>
              </div>
            </div>
          </Link>
        </Reveal>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Tooling" title="Assessment tooling" />
        <CardGrid
          columns={2}
          items={[
            { title: "AI assessment", body: "A measured view of your AI readiness, data foundations, governance, use-case portfolio and the path from pilots to production, with clear recommendations.", href: "/solutions/ai-assessment", cta: "Request an assessment →" },
            {
              title: "Quantexa maturity assessment",
              body: "A structured review of your Quantexa estate, implementation quality, self-sufficiency, delivery practice and resource capability, with scored findings and a prioritised roadmap.",
              href: "/solutions/quantexa-maturity-assessment",
              cta: "Benchmark your estate →",
              logo: <TechnologyLogo slug="quantexa" decorative className="mt-1 h-7 sm:h-8" sizes="(min-width: 768px) 18vw, 48vw" />,
            },
          ]}
        />
      </ContentSection>
      <CTASection title="See a solution in action" body="We'll walk you through the solutions against your own use cases." label="Request a demo" />
    </>
  );
}

function ComingSoonPill() {
  return (
    <span
      aria-label="VBricks site coming soon"
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-4 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
    >
      <span aria-hidden className="size-1.5 rounded-full bg-signal shadow-[0_0_0_4px_rgba(35,79,189,0.08)]" />
      Coming soon
    </span>
  );
}

function ProductHero({ product }: { product: "qbricks" | "vbricks" }) {
  const qbricks = product === "qbricks";
  return (
    <section className="relative overflow-hidden border-b hairline pb-20 pt-36 md:pb-24 md:pt-40">
      <div aria-hidden className={`absolute inset-0 ${qbricks ? "bg-[radial-gradient(circle_at_82%_30%,rgba(214,17,31,0.08),transparent_28rem)]" : "bg-[radial-gradient(circle_at_82%_30%,rgba(35,79,189,0.09),transparent_28rem)]"}`} />
      <div className="relative mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Link href="/solutions" className="link-wipe inline-block font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors hover:text-signal">
            ← Our solutions
          </Link>
          {/* the wordmark in the brand face, so it sits on the paper like
              the rest of the type — the boxed white-on-black PNG fought it */}
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {qbricks ? (
              <p data-testid="product-wordmark" className="text-(length:--text-step-4) leading-none">
                <QBricksWord />
              </p>
            ) : (
              <>
                <p data-testid="product-wordmark" className="font-hero text-(length:--text-step-4) font-semibold tracking-[-0.025em] text-paper">VBricks</p>
                <ComingSoonPill />
              </>
            )}
          </div>
          <h1 className="mt-8 max-w-3xl text-(length:--text-step-5) leading-[1.01]">
            {qbricks ? "No more data pipelines." : "A major change in model testing."}
          </h1>
          <p className="mt-7 max-w-2xl text-(length:--text-step-1) leading-relaxed text-ice">
            {qbricks
              ? "Turn systems of record into governed, A.I.-ready data products in hours, not months or years."
              : "Turn weeks of manual model validation into a repeatable, engineered process with automated test packs, challenger comparisons and complete evidence trails."}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            {qbricks ? (
              <a
                href="https://qbricks.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sheen inline-flex min-h-11 items-center bg-[#d6111f] px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(214,17,31,0.18)] transition-[background-color,box-shadow,transform] duration-(--duration-fast) hover:bg-[#b50d19] hover:shadow-[0_10px_28px_rgba(181,13,25,0.24)] active:translate-y-px"
              >
                Visit the QBricks website ↗
              </a>
            ) : (
              <PrimaryLink href="/contact">Request a demo →</PrimaryLink>
            )}
            <SecondaryLink href="/contact">Talk to our team →</SecondaryLink>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6">
          <div className="overflow-hidden border hairline bg-white/80 p-3 shadow-[0_20px_54px_rgba(23,56,102,0.09)] backdrop-blur-sm">
            <GlassImage
              image={siteImage(qbricks ? "qbricks" : "tbricks")}
              alt={qbricks ? "QBricks governed data product architecture" : "VBricks engineered model testing system"}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              imageClassName="aspect-[4/3] object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function QBricksPage() {
  return (
    <>
      <ProductHero product="qbricks" />
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="Watch" title="An introduction to QBricks" />
        <Reveal>
          <QBricksFilm />
        </Reveal>
      </ContentSection>
      <ContentSection>
        <SectionIntro
          eyebrow="What it does"
          title="A governed foundation for production AI"
          body="QBricks is a streaming data-management platform that enforces governance at the point of ingestion, so data reaches your lakehouse or database trusted, portable and ready for use."
        />
        <NumberedCards
          items={[
            { num: "01", title: "Streaming & incremental", body: "Real-time, change-focused updates underpinned by the Open Data Contract Standard." },
            { num: "02", title: "Contract-enforced governance", body: "Records are assessed against your governance framework as they enter the platform, not after the fact." },
            { num: "03", title: "Agentic metadata", body: "Agents handle routine metadata work while governance, risk and data teams retain approval and control." },
            { num: "04", title: "Lineage & knowledge graphs", body: "Trace products back to their underlying tables, joins and relationships through clickable lineage." },
            { num: "05", title: "Local compute", body: "Run with Databricks, Microsoft Fabric, Snowflake or your own database through SQL push-down." },
            { num: "06", title: "Fully auditable", body: "Transformations, agent actions, exceptions and before-and-after outputs remain visible and defensible." },
          ]}
        />
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="The difference" title="Replace pipeline sprawl with a controlled data-product system" />
        <div className="grid gap-px lg:grid-cols-2">
          <article className="border hairline bg-white/72 p-8 md:p-10">
            <p className="eyebrow text-steel">Without QBricks</p>
            <h2 className="mt-5 text-(length:--text-step-2)">Complexity compounds</h2>
            <ul className="mt-7 space-y-4 text-ice">
              {["Thousands of ungoverned notebooks", "Large teams maintaining bespoke pipelines", "Long build and deployment timelines", "AI-ready data trapped behind remediation work", "Ongoing cloud and compute overhead"].map((item) => (
                <li key={item} className="flex gap-3 border-t hairline pt-4"><span aria-hidden className="text-steel">—</span><span>{item}</span></li>
              ))}
            </ul>
          </article>
          <article className="relative overflow-hidden border hairline bg-white p-8 shadow-[0_18px_48px_rgba(23,56,102,0.07)] md:p-10">
            <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-[#d6111f]" />
            <p className="eyebrow text-[#d6111f]">With QBricks</p>
            <h2 className="mt-5 text-(length:--text-step-2)">Governance becomes the foundation</h2>
            <ul className="mt-7 space-y-4 text-ice">
              {["Governance enforced by data contract", "Automatic pipeline builds and materialised views", "AI-ready data available in hours", "Open, portable products for your existing platforms", "Lower compute with no mandatory cloud dependency"].map((item) => (
                <li key={item} className="flex gap-3 border-t hairline pt-4"><span aria-hidden className="text-[#d6111f]">↳</span><span>{item}</span></li>
              ))}
            </ul>
          </article>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro
          eyebrow="The operating model"
          title="From system of record to governed consumption"
          body="QBricks strengthens the technology estate you already have. It can stream directly from operational systems or process data after it lands in a governed database."
        />
        <NumberedCards
          items={[
            { num: "01", title: "Systems of record", body: "Core banking, payments, cards, treasury, trading, CRM and operational databases." },
            { num: "02", title: "QBricks", body: "Ingest, contract, govern and enrich continuously, with human approval and complete lineage." },
            { num: "03", title: "Production use", body: "BI and analytics, AI and ML, operational activation, regulatory reporting and decisioning." },
          ]}
        />
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t hairline pt-8">
          <a href="https://qbricks.ai" target="_blank" rel="noopener noreferrer" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-[#d6111f]">
            Explore QBricks.ai ↗
          </a>
          <SecondaryLink href="/solutions/vbricks">Explore VBricks →</SecondaryLink>
        </div>
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro
          eyebrow="Use cases"
          title="Built for the work that burns data budgets"
          body="Each use case below is drawn from programmes we have delivered by hand — QBricks packages that delivery experience into a product."
        />
        <NumberedCards
          items={[
            { title: "AML & KYC data products", body: "Entity-ready customer and counterparty data for financial-crime platforms — contracted quality and lineage that stands up to a regulator's audit trail, feeding tools like Quantexa without months of remediation." },
            { title: "Regulatory reporting", body: "A governed, single source of trading and finance data for reporting cycles — the same problem we cut from four weeks to five minutes by hand, now productised so the pipeline builds itself." },
            { title: "AI-ready data estates", body: "Governed data products that make AI programmes possible: contracted schema, quality and ownership per product, so models train and run on data your firm can defend." },
          ]}
        />
        <div className="mt-12">
          <p className="eyebrow mb-6 text-signal">The delivery experience behind it</p>
          <div className="grid gap-px md:grid-cols-2">
            {["regulatory-reporting", "big-data-engineering"].map((slug) => {
              const c = caseStudy(slug);
              return c ? <CaseStudyCard key={slug} c={c} /> : null;
            })}
          </div>
        </div>
      </ContentSection>
      <CTASection title="From record to report in minutes" body="See how governed data contracts and products are created against your own use case." label="Request a demo" />
    </>
  );
}

export function VBricksPage() {
  return (
    <>
      <ProductHero product="vbricks" />
      <ContentSection>
        <SectionIntro
          eyebrow="What it does"
          title="Validation engineered for regulated models"
          body="VBricks transforms model testing from a manual project into a controlled capability that can be run on demand, repeated consistently and defended under scrutiny."
        />
        <NumberedCards
          items={[
            { num: "01", title: "Automated test packs", body: "Codify repeatable testing across model types instead of rebuilding the process for every validation cycle." },
            { num: "02", title: "Challenger comparisons", body: "Compare model behaviour and outcomes consistently, with the evidence needed to explain the result." },
            { num: "03", title: "Complete evidence trails", body: "Preserve inputs, test execution, exceptions, review and approval in one defensible record." },
            { num: "04", title: "On-demand execution", body: "Run validation when the model or environment changes rather than waiting for a lengthy manual cycle." },
            { num: "05", title: "Human review", body: "Automation accelerates the work while model risk teams retain judgement, accountability and sign-off." },
            { num: "06", title: "Regulatory confidence", body: "A transparent testing process built for model risk management, internal audit and regulatory scrutiny." },
          ]}
        />
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="How it works" title="One controlled path from model to evidence" />
        <NumberedCards
          items={[
            { num: "01", title: "Define", body: "Set the model scope, validation policy, test pack, thresholds and required evidence." },
            { num: "02", title: "Execute", body: "Run automated tests and challenger comparisons against credit, KYC, fraud, AML and adjacent models." },
            { num: "03", title: "Defend", body: "Review exceptions, record decisions and produce a complete evidence trail for approval and scrutiny." },
          ]}
        />
        <div className="mt-12 border hairline bg-white/78 p-8 shadow-[0_12px_34px_rgba(23,56,102,0.055)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="eyebrow text-signal">Model coverage</p>
              <p className="mt-3 max-w-2xl text-ice">Designed for credit, KYC, fraud and AML models, with an architecture intended to extend across the wider model estate.</p>
            </div>
            <ComingSoonPill />
          </div>
        </div>
      </ContentSection>
      <ContentSection>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionIntro eyebrow="Built in DIFC, Dubai" title="Created by practitioners who understand the scrutiny" body="VBricks is designed and developed by our Dubai R&D team for the control, repeatability and evidence standards expected by financial institutions." />
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <PrimaryLink href="/contact">Request a VBricks demo →</PrimaryLink>
          </div>
        </div>
      </ContentSection>
      <CTASection title="Make model testing repeatable" body="Talk to the team about your validation estate and the first model family to engineer." label="Speak to an expert" />
    </>
  );
}

export function AssessmentPage({ kind }: { kind: "ai" | "quantexa" }) {
  const ai = kind === "ai";
  return (
    <>
      <HeroSection
        backHref="/solutions"
        backLabel="Our solutions"
        eyebrow="Assessment tooling"
        title={ai ? "AI assessment: know where AI pays back first" : "How mature is your Quantexa capability?"}
        brand={!ai ? <TechnologyLogo slug="quantexa" decorative className="h-8 sm:h-10" sizes="220px" /> : undefined}
        body={
          ai
            ? "A measured, practitioner-built view of your AI readiness, from data foundations to governance, so you can move from pilots to production with confidence."
            : "The Infinium Quantexa Maturity Assessment benchmarks your organisation against 750+ proven criteria across four dimensions — so you know exactly where you stand, and exactly what to fix first."
        }
        actions={[{ href: "/contact", label: "Request an assessment" }]}
        stats={!ai ? [
          { value: "750+", label: "Assessment questions" },
          { value: "4", label: "Focus areas" },
          { value: "20+", label: "Quantexa projects behind it" },
        ] : [
          { value: "4", label: "Readiness dimensions, scored" },
          { value: "1", label: "Prioritised use-case portfolio" },
          { value: "1", label: "Sequenced roadmap to production" },
        ]}
      />
      {ai ? (
        <>
          <ContentSection>
            <SectionIntro eyebrow="Why it matters" title="Most AI programmes stall for reasons visible on day one" />
            <Reveal className="max-w-3xl space-y-5 leading-relaxed text-ice">
              <p>Most banks and insurers do not lack AI ideas — they lack a defensible view of which ideas their data, controls and teams can actually carry to production. Pilots multiply, budgets fragment, and the honest questions arrive late: can our data feed this reliably? Would this survive model validation? Who runs it after the consultants leave?</p>
              <p>The AI assessment answers those questions before you commit serious money. It is a structured, evidence-based review of your AI readiness — built by practitioners who deliver agentic AI into production for regulated financial services firms, not by a strategy desk.</p>
              <p>The result is not a maturity poster. It&rsquo;s a scored readiness profile, a use-case portfolio ranked by value, feasibility and risk, and a sequenced set of recommendations — what to fix, build and govern first.</p>
            </Reveal>
          </ContentSection>
          <ContentSection className="bg-abyss/20">
            <SectionIntro eyebrow="What we assess" title="Four dimensions, scored on evidence" />
            <div className="space-y-px">
              {([
                ["01", "Data foundations", "Can your data estate feed AI reliably?",
                  "We examine quality, lineage, governance and access across the data that would feed your priority use cases: where it lives, who owns it, how it is contracted and controlled, and how much remediation stands between today's estate and model-grade inputs.",
                  "A clear read on the real cost of data readiness — usually the largest and most underestimated line in any AI business case — and where engineered solutions like QBricks collapse that cost."],
                ["02", "Use-case portfolio", "Which use cases will genuinely move the business?",
                  "We inventory the AI work underway and proposed — financial crime, credit, fraud, servicing, reporting and beyond — and score each for value, feasibility and risk against your data and control reality, not the vendor demo.",
                  "A prioritised portfolio your board can fund with confidence: what to accelerate, what to pause, and what to stop — with the reasoning documented."],
                ["03", "Governance & risk", "Would your AI survive supervisory scrutiny?",
                  "We assess model governance, human-in-the-loop controls, auditability and regulatory alignment — including EU AI Act and DORA obligations — against what supervised firms are actually being asked to evidence.",
                  "The gap list between your current controls and defensible production AI, sequenced so governance work enables delivery rather than trailing it."],
                ["04", "Pilots to production", "Can your operating model industrialise AI?",
                  "We review the engineering practice, platform foundations, skills and operating model needed to run AI as a capability: environments, MLOps, monitoring, and who owns each model in run.",
                  "A realistic capability plan — what to hire, train, buy and partner for — so production AI survives the departure of whoever built the pilot."],
              ] as const).map(([num, title, question, approach, gain]) => (
                <article key={num} className="grid gap-x-10 gap-y-6 border hairline bg-white/82 p-7 sm:p-9 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{num}</p>
                    <h3 className="mt-4 text-(length:--text-step-2) leading-tight">{title}</h3>
                    <p className="mt-4 leading-relaxed text-ice">{question}</p>
                  </div>
                  <div className="space-y-6 md:col-span-8">
                    <div>
                      <p className="eyebrow text-steel">What we examine</p>
                      <p className="mt-3 leading-relaxed text-ice">{approach}</p>
                    </div>
                    <div>
                      <p className="eyebrow text-signal">What you gain</p>
                      <p className="mt-3 leading-relaxed text-ice">{gain}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ContentSection>
          <ContentSection>
            <SectionIntro eyebrow="How it runs" title="Evidence in, decisions out" />
            <NumberedCards
              items={[
                { num: "Step 01", title: "Discover", body: "Structured interviews with data, risk, technology and business owners, plus artefact review — architectures, model inventories, control frameworks, live pilot results." },
                { num: "Step 02", title: "Assess", body: "Each dimension scored on evidence against how production AI actually runs in regulated finance — not against a generic maturity model." },
                { num: "Step 03", title: "Report", body: "Readiness profile, prioritised use-case portfolio and sequenced roadmap, presented to your leadership with the reasoning open to challenge." },
              ]}
            />
            <div className="mt-14 border hairline bg-abyss/25 p-8">
              <p className="eyebrow text-signal">Where it leads</p>
              <h3 className="mt-4 text-(length:--text-step-2)">The first step of the AI Factory</h3>
              <p className="mt-5 max-w-3xl leading-relaxed text-ice">For firms ready to industrialise, the assessment doubles as the entry point to our AI Factory — the packaged offering that builds one governed AI capability: data engine, platform, delivery pods and operating model.</p>
              <p className="mt-6"><SecondaryLink href="/solutions/ai-factory">Explore the AI Factory →</SecondaryLink></p>
            </div>
          </ContentSection>
          <CTASection title="Is your business ready for AI?" body="Talk to our practice leads about running the assessment." />
        </>
      ) : (
        <>
          <ContentSection>
            <SectionIntro eyebrow="Why it matters" title="Power alone doesn't deliver outcomes" />
            <Reveal className="max-w-3xl space-y-5 leading-relaxed text-ice">
              <p>Quantexa is a powerful platform — but power alone doesn&rsquo;t deliver outcomes. The difference between a Quantexa deployment that transforms decisioning and one that stalls in delivery is rarely the software. It&rsquo;s the maturity of everything around it: how the platform is engineered, how solutions are designed, how change is delivered and tested, and whether the right people are in the right roles.</p>
              <p>The Infinium Quantexa Maturity Assessment is a structured, evidence-based benchmark of your entire Quantexa capability. Built from real-world delivery experience across banking, financial markets and insurance, it examines your implementation through more than 750 targeted questions spanning four focus areas: Platform &amp; Solution Design, Project Delivery, Testing, and Resource Capability.</p>
              <p>The result is not a generic scorecard. It&rsquo;s a precise map of your strengths and weaknesses, benchmarked against how the best Quantexa implementations operate — with a prioritised, practical roadmap for closing the gaps.</p>
            </Reveal>
            <Reveal className="mt-10 max-w-3xl border-l-2 border-cobalt pl-6">
              <p className="leading-relaxed text-glass"><strong className="text-paper">Engineering with context.</strong> We don&rsquo;t assess from the sidelines; every question in the framework exists because we&rsquo;ve seen it decide the success or failure of a live programme.</p>
            </Reveal>
          </ContentSection>
          <ContentSection>
            <SectionIntro eyebrow="The four focus areas" title="What we examine, and what you gain" />
            <div className="space-y-px">
              {([
                ["01", "Platform & Solution Design", "Is your Quantexa estate engineered to scale — and are your solutions designed to last?",
                  "We examine the technical foundations of your deployment end to end: environment architecture, infrastructure and capacity, upgrade posture and version currency, security and access design, and operational resilience. On the solution side, we go deep into the decisions that determine long-term value — entity resolution configuration and tuning, data model and source-onboarding patterns, network generation, scoring logic, and how well your design standards keep multiple use cases coherent on one platform rather than becoming a set of disconnected builds.",
                  "A clear view of whether your platform can support where you're heading — more data, more use cases, more users — before you commit to it. Design weaknesses are the most expensive category of Quantexa problem to fix late; this assessment surfaces them while they're still cheap. You'll also see where sound engineering already exists, so you can codify it as your standard rather than reinventing it per project."],
                ["02", "Project Delivery", "Does your delivery model get Quantexa change into production predictably?",
                  "We assess how Quantexa work actually flows through your organisation: delivery methodology and cadence, backlog and scope management, estimation accuracy, environment and release management, dependency handling with upstream data teams, stakeholder governance, and the quality of the handover from project into run. We look at real delivery artefacts and real release history — not just the operating model on paper.",
                  "An honest read on delivery predictability, and a diagnosis of why releases slip when they slip. Most Quantexa programmes lose time in the same handful of places — data readiness, environment contention, unclear definition-of-done — and the assessment shows you which of these are costing you, quantified against what good looks like. The benefit is faster, calmer releases and a delivery plan leadership can actually rely on."],
                ["03", "Testing", "Can you prove your Quantexa outputs are right — and keep proving it, release after release?",
                  "Testing Quantexa is not like testing a conventional application: entity resolution, network generation and scoring demand their own disciplines. We assess your test strategy across every layer — data ingestion and transformation testing, entity resolution quality measurement, scenario and score validation, regression coverage across upgrades and config change, performance and volume testing, and the automation that makes all of this repeatable rather than heroic.",
                  "Confidence that the results your investigators, analysts and models depend on are demonstrably correct — and evidence you can put in front of model validation, internal audit and regulators. You'll learn where your regression safety net has holes, where manual effort can be automated, and how to make each release cheaper to assure than the last, so testing accelerates delivery instead of gating it."],
                ["04", "Resource Capability", "Do you have the right people, in the right roles, with a path to self-sufficiency?",
                  "We map your Quantexa organisation against the roles a healthy capability needs — platform engineers, data engineers, solution designers, scorecard and analytics specialists, testers, product owners — and assess depth, certification coverage, key-person risk and the balance between partners and permanent staff. We also examine how knowledge moves: onboarding, documentation, communities of practice, and whether expertise is compounding inside your organisation or leaving with every contractor rotation.",
                  "A skills heat-map showing exactly where you're strong, thin or exposed, and a realistic capability plan: who to hire, who to train, what to document, and where partner support genuinely adds value versus where it's masking a gap. The benefit is durable self-sufficiency — a team that can run, extend and improve Quantexa on its own terms, with vendor and partner spend directed where it counts."],
              ] as const).map(([num, title, question, approach, gain]) => (
                <article key={num} className="grid gap-x-10 gap-y-6 border hairline bg-white/82 p-7 sm:p-9 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{num}</p>
                    <h3 className="mt-4 text-(length:--text-step-2) leading-tight">{title}</h3>
                    <p className="mt-4 leading-relaxed text-ice">{question}</p>
                  </div>
                  <div className="space-y-6 md:col-span-8">
                    <div>
                      <p className="eyebrow">Our approach</p>
                      <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-glass">{approach}</p>
                    </div>
                    <div>
                      <p className="eyebrow">What you gain</p>
                      <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-glass">{gain}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ContentSection>
          <ContentSection>
            <SectionIntro
              eyebrow="Sample output — illustrative"
              title="What the report looks like"
              body="Every engagement ends in a scored, evidence-backed report. The figures below are illustrative, drawn from a representative assessment."
            />

            {/* the four pillar scores — ruled cells, weak pillars flagged */}
            <Reveal className="grid grid-cols-2 gap-px border hairline lg:grid-cols-4">
              {([
                ["Platform & solution design", 72, "Infrastructure the strongest area", "ok"],
                ["Project delivery", 80, "Leadership & governance leading", "ok"],
                ["Testing", 35, "The clearest gap in the estate", "focus"],
                ["Resource capability", 55, "Capability still at novice level", "watch"],
              ] as const).map(([label, score, note, state]) => (
                <div
                  key={label}
                  className={`p-6 sm:p-7 ${
                    state === "focus" ? "bg-error/[0.06]" : state === "watch" ? "bg-warning/[0.06]" : "bg-white/82"
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-steel">{label}</p>
                  <p
                    className={`mt-3 font-display text-(length:--text-step-3) leading-none ${
                      state === "focus" ? "text-error" : state === "watch" ? "text-warning" : "text-paper"
                    }`}
                  >
                    {score}%
                  </p>
                  <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{note}</p>
                </div>
              ))}
            </Reveal>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {/* highest-scoring capabilities — quiet cobalt bars */}
              <Reveal className="border hairline bg-white/82 p-7">
                <p className="eyebrow text-signal">Highest-scoring capabilities</p>
                <ul className="mt-6 space-y-4">
                  {([
                    ["Entity resolution quality", 96],
                    ["Platform architecture", 91],
                    ["Data ingestion", 88],
                    ["Delivery governance", 87],
                    ["Scoring configuration", 80],
                  ] as const).map(([cap, v]) => (
                    <li key={cap} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[11rem_1fr_auto]">
                      <span className="text-(length:--text-body-sm) text-glass">{cap}</span>
                      <span aria-hidden className="hidden h-1.5 overflow-hidden rounded-full bg-abyss/60 sm:block">
                        <span className="block h-full rounded-full bg-cobalt" style={{ width: `${v}%` }} />
                      </span>
                      <span className="font-mono text-(length:--text-label) text-paper tabular-nums">{v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* movement since the last assessment — the benchmark over time */}
              <Reveal className="border hairline bg-white/82 p-7">
                <p className="eyebrow text-signal">Movement since the last assessment</p>
                <ul className="mt-6 divide-y divide-navy/10">
                  {([
                    ["Test automation", 35, 75],
                    ["Data controls", 50, 77],
                    ["Component adoption", 66, 96],
                    ["Learning pathways", 74, 87],
                  ] as const).map(([cap, from, to]) => (
                    <li key={cap} className="flex items-baseline justify-between gap-4 py-3.5">
                      <span className="text-(length:--text-body-sm) text-glass">{cap}</span>
                      <span className="font-mono text-(length:--text-label) tabular-nums">
                        <span className="text-steel">{from}%</span>
                        <span aria-hidden className="mx-2 text-steel">→</span>
                        <span className="text-success">{to}%</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-(length:--text-body-sm) leading-relaxed text-ice">
                  Re-running the assessment turns the score into a benchmark — progress is measured, not asserted.
                </p>
              </Reveal>
            </div>

            {/* where attention pays back fastest */}
            <Reveal className="mt-4 border hairline bg-abyss/25 p-7">
              <p className="eyebrow text-signal">Where attention pays back fastest</p>
              <div className="mt-6 grid gap-px border hairline bg-ice/12 md:grid-cols-3">
                {([
                  ["01", "Testing", "Coverage and automation are the clearest gap — findings are concentrated, not systemic, so focused effort moves the score quickly."],
                  ["02", "Data controls", "Controls exist but are unevenly applied across the estate; standardising them removes the widest spread of low scores."],
                  ["03", "Component adoption", "Secondary components are under-used relative to licence; adoption unlocks value already paid for."],
                ] as const).map(([num, title, body]) => (
                  <div key={num} className="bg-surface/82 p-6">
                    <p className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{num}</p>
                    <h3 className="mt-4 text-(length:--text-step-1) leading-tight">{title}</h3>
                    <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </ContentSection>
          <ContentSection>
            <SectionIntro eyebrow="How it works" title="Four steps, eight weeks" />
            <NumberedCards
              columns={4}
              items={[
                { title: "Discover", body: "We agree scope, gather documentation and system evidence, and schedule structured sessions with your platform, delivery, testing and business teams." },
                { title: "Assess", body: "Our practitioners work through the 750+ question framework — a blend of evidence review, hands-on inspection and interviews — scoring each area against defined maturity levels." },
                { title: "Benchmark", body: "Your results are compared against our reference model of high-performing Quantexa implementations, area by area." },
                { title: "Roadmap", body: "You receive a full findings report, an executive summary, and a prioritised improvement roadmap — sequenced by impact, effort and risk, and ready to execute." },
              ]}
            />
            <p className="mt-8 max-w-3xl text-(length:--text-body-sm) leading-relaxed text-ice">Typical elapsed time: eight weeks, with minimal disruption to in-flight delivery.</p>

            <Reveal className="mt-14">
              <AssessmentDashboard />
            </Reveal>

            <div className="mt-14 grid gap-px border hairline md:grid-cols-2">
              <div className="bg-abyss/25 p-7 sm:p-8">
                <p className="eyebrow text-signal">Why Infinium</p>
                <p className="mt-4 leading-relaxed text-glass">We are engineers first. Our assessors have designed, delivered, tested and run Quantexa in production at scale — the framework distils that experience into a benchmark you can act on. And because we deliver improvement programmes as well as assessments, every recommendation is one we&rsquo;d be prepared to implement ourselves.</p>
              </div>
              <div className="flex flex-col justify-between gap-6 bg-white/82 p-7 sm:p-8">
                <div>
                  <p className="eyebrow text-signal">Take it with you</p>
                  <h3 className="mt-4 text-(length:--text-step-1) leading-tight">The Quantexa Benchmark, on one page</h3>
                  <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">The focus areas, the process and the outcome — a one-page overview to share with your team.</p>
                </div>
                <p>
                  <a
                    href="/downloads/infinium-quantexa-benchmark.pdf"
                    download
                    className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-cobalt transition-colors duration-(--duration-fast) hover:text-navy"
                  >
                    Download the one-pager (PDF, 0.7&nbsp;MB) ↓
                  </a>
                </p>
              </div>
            </div>
          </ContentSection>
          <CTASection title="Know where you stand. Fix what matters first." body="Book a scoping conversation and we'll walk you through the framework, the process and what your benchmark would cover." label="Talk to us about your assessment" />
        </>
      )}
    </>
  );
}

export function AIFactoryPage() {
  return (
    <>
      <HeroSection
        backHref="/solutions"
        backLabel="Our solutions"
        eyebrow="Packaged offering"
        title="From AI pilots to an industrial AI capability."
        body="Most banks run AI as a series of disconnected pilots. The AI Factory is our packaged offering to build one governed capability — data engine, platform, delivery pods and operating model — that serves every use case across the firm, engineered for regulated finance."
        actions={[
          { href: "/contact", label: "Start with a factory assessment" },
          { href: "/solutions/qbricks", label: "Explore QBricks →" },
        ]}
        stats={[
          { value: "4 weeks", label: "To an assessed, costed factory blueprint" },
          { value: "1 platform", label: "Shared data, models and controls — built once" },
          { value: "Every use case", label: "Financial crime, credit, fraud, servicing, reporting" },
        ]}
      />
      <FactoryLineBand />
      <ContentSection>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow text-signal">Why a factory</p>
            <h2 className="mt-5 text-(length:--text-step-3) leading-[1.03]">Pilots prove ideas. Factories deliver returns.</h2>
          </Reveal>
          <Reveal className="lg:col-span-7">
            <p className="border-t hairline py-5 text-(length:--text-step-1) leading-relaxed text-ice">Every large consultancy now sells an AI factory. What they share is the right instinct: AI only pays back when data, models, governance and delivery are industrialised — not rebuilt per use case.</p>
            <p className="border-t hairline py-5 text-(length:--text-step-1) leading-relaxed text-ice">Our difference is where we start. In a bank, the factory constraint is never the model — it&rsquo;s the data and the audit trail. So our factory is built around a data engine, <QBricksWord />, that remediates legacy data, generates pipelines and codifies data contracts before a single model ships.</p>
            <p className="border-y hairline py-5 text-(length:--text-step-1) leading-relaxed text-ice">The result is a smaller, faster factory: pre-built components in place of programme headcount, and measurable outcomes — working systems, automated processes, realised savings — not slideware.</p>
          </Reveal>
        </div>
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="The offering" title="Four services, one capability" />
        <NumberedCards
          columns={4}
          items={[
            { title: "Factory assessment & blueprint", body: "A four-week review of your data estate, AI portfolio and controls — producing a costed target architecture, a prioritised use-case backlog and a business case your board can sign." },
            { title: "Data engine, powered by QBricks", body: "Remediation of legacy data, auto-generated pipelines and codified data contracts — trusted, contracted data products on your cloud platform, delivered in months not years." },
            { title: "Use-case delivery pods", body: "Small, senior, on-shore pods that ship production use cases on the shared platform — financial crime, credit decisioning, fraud, customer servicing, regulatory reporting." },
            { title: "Operate, govern & enable", body: "Model risk and AI governance aligned to EU AI Act and DORA, run-and-monitor operations, and a structured enablement cascade so your teams own the factory — not ours." },
          ]}
        />
      </ContentSection>
      <ContentSection>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow text-signal">The engine room</p>
            <h2 className="mt-5 text-(length:--text-step-3) leading-[1.03]"><QBricksWord /> makes the factory economics work</h2>
            <p className="mt-5 leading-relaxed text-ice">Designed and developed in the Netherlands by our R&amp;D team, QBricks compresses the most expensive phase of any AI programme — making bank data trustworthy. What competitors staff with hundreds of consultants, the factory does with pre-built, high-end engineered components.</p>
            <p className="mt-8"><SecondaryLink href="/solutions/qbricks">Explore QBricks &amp; VBricks →</SecondaryLink></p>
          </Reveal>
          <Reveal className="space-y-px lg:col-span-6">
            {[
              ["Data remediation", "Profiles, cleanses and standardises siloed legacy data at scale"],
              ["Pipeline generation", "Auto-generates ingestion and transformation pipelines for your cloud platform"],
              ["Data contract generation", "Codifies schema, quality and ownership per data product — the audit trail regulators expect"],
            ].map(([title, body]) => (
              <article key={title} className="border hairline bg-surface/82 p-6 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
                <h3 className="text-(length:--text-step-1) leading-tight">{title}</h3>
                <p className="mt-2 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="How an engagement runs" title="Assess, build, scale" />
        <NumberedCards
          items={[
            { num: "Weeks 1–4", title: "Assess", body: "Factory assessment across data, platform, governance and skills. Output: blueprint, backlog, business case." },
            { num: "Months 2–5", title: "Build", body: "Stand up the factory foundation: QBricks data engine, platform controls and the first production use case as proof." },
            { num: "Month 6 onwards", title: "Scale", body: "Delivery pods ship use case after use case on the shared platform, while enablement transfers ownership to your teams." },
          ]}
        />
      </ContentSection>
      <CTASection title="Ready to industrialise AI?" body="Start with a free goals review with one of our industry practice leads." label="Schedule a discussion" />
    </>
  );
}

/* Consolidated from the csrd.consulting microsite (client direction,
 * 21 Jul 2026) so the microsite can be retired. Copy — hub descriptions,
 * framework dates and testimonials — is carried over verbatim. */
export function ESGReportingPage() {
  const testimonials = [
    ["Your solution solves data processing for structured and unstructured information across the entire process.", "Senior Reporting Lead", "Major Dutch corporate"],
    ["Solution significantly reduces audit burden and demonstrates keystroke-level auditability from sourcing to report.", "Reporting Lead", "Dutch corporate"],
    ["Built on proven technology with extensive client base significantly de-risks the implementation process.", "Head of Reporting COE", "Major international bank"],
    ["Alteryx's market-leading platform enables quick data source additions and multiple format processing.", "Data Analyst", "Major US bank"],
    ["Built-in horizon scanner links regulations throughout the process, demonstrating regulatory traceability.", "CSRD Reporting Lead", "Major UAE bank"],
    ["AI-powered draft report generation from narrative and numeric inputs saves significant time and effort.", "ESG Reporting Lead", "MENA bank"],
  ] as const;

  return (
    <>
      <HeroSection
        backHref="/solutions"
        backLabel="Our solutions"
        eyebrow="Our solutions"
        title="Audit-ready ESG disclosure, on one governed platform."
        body="Financial institutions struggle with complex data for ESG reporting. Our AI-enabled solution is a modular, three-hub platform — data sourcing, processing and reporting — built on proven technology and powered by a best-in-class Alteryx data analytics engine."
        actions={[
          { href: "/contact", label: "Request a demo" },
          { href: "/services/sustainable-finance", label: "ESG services →" },
        ]}
        stats={[
          { value: "3", label: "Hubs — sourcing, processing, reporting" },
          { value: "4", label: "Frameworks — CSRD, CSDDD, GRI & ISSB" },
          { value: "8,000+", label: "Clients on the underlying Alteryx platform" },
        ]}
      />
      <ContentSection>
        <SectionIntro
          eyebrow="Why now"
          title="A shift in ESG disclosure, written into law"
          body="New regulatory frameworks have turned ESG reporting from voluntary communication into a supervised obligation — with the data burden landing on finance, risk and sustainability teams at once."
        />
        <Reveal className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {([
            ["CSRD", "The Corporate Sustainability Reporting Directive — in force since 5 January 2023."],
            ["CSDDD", "The Corporate Sustainability Due Diligence Directive 2024/1760 — in force since 25 July 2024."],
            ["GRI", "The Global Reporting Initiative — the most widely used voluntary sustainability reporting standards."],
            ["ISSB", "The IFRS Foundation's International Sustainability Standards Board, launched at COP26, Glasgow."],
          ] as const).map(([name, body]) => (
            <article key={name} className="border hairline bg-surface/82 p-6 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
              <h3 className="font-mono text-(length:--text-step-1) tracking-[0.02em] text-signal">{name}</h3>
              <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
            </article>
          ))}
        </Reveal>
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="The platform" title="Three hubs, one governed flow from source to disclosure" />
        <NumberedCards
          items={[
            { title: "Data sourcing", body: "A workflow-driven solution that supports the collection of ESG data both within and outside of an organisation — bespoke questionnaires, stakeholder engagement and gap identification built in." },
            { title: "Data processing", body: "Consolidate, cleanse, prepare, process and report structured and unstructured data types at scale, using Alteryx." },
            { title: "Reporting", body: "Produce real-time management information to support strategic decisions and precise portfolio management — with export to the formats regulators expect, including XBRL." },
          ]}
        />
        <div className="mt-12 border hairline bg-white/78 p-8 shadow-[0_12px_34px_rgba(23,56,102,0.055)]">
          <p className="eyebrow text-signal">What&rsquo;s built in</p>
          <ul className="mt-6 grid gap-x-8 gap-y-3 text-(length:--text-body-sm) text-ice sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Compliance with GRI, ESRS & ISSB standards",
              "Horizon scanning with custom AI models",
              "Advanced AI data analytics via Alteryx",
              "Open API data integration",
              "Stakeholder engagement workflow",
              "Materiality assessment",
              "Gap analysis",
              "System integration",
              "Structured & unstructured data processing",
              "Portfolio tracking",
              "Emission tracking",
              "Audit logging",
            ].map((f) => (
              <li key={f} className="flex gap-3 border-t hairline pt-3"><span aria-hidden className="text-signal">↳</span><span>{f}</span></li>
            ))}
          </ul>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="What reporting teams say" title="Less audit burden, faster reports, traceable regulation" />
        <Reveal className="grid gap-px md:grid-cols-3">
          {testimonials.map(([quote, who, org]) => (
            <article key={quote} className="flex h-full flex-col justify-between border hairline bg-abyss/25 p-7">
              <blockquote className="leading-relaxed text-glass">&ldquo;{quote}&rdquo;</blockquote>
              <footer className="mt-6">
                <p className="text-(length:--text-body-sm) text-paper">{who}</p>
                <p className="eyebrow mt-1">{org}</p>
              </footer>
            </article>
          ))}
        </Reveal>
      </ContentSection>
      <CTASection
        title="ESG obligations landing on your desk?"
        body="Talk to a practice lead about your reporting obligations and timeline — we'll show the platform against your own frameworks."
        label="Request a demo"
      />
    </>
  );
}

/* ---- Sectors, technologies, insights ---------------------------------- */

export function SectorsWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="Where we work"
        title="Sectors"
        body="Deep, current experience across the regulated financial landscape, capital markets, banking, insurance, wealth and the fintech community."
      />
      <ContentSection>
        {/* h1 → h3 skipped a level without this */}
        <SectionIntro eyebrow="Our coverage" title="Where our experience runs deepest" />
        <NumberedCards items={SECTORS.map((s) => ({ ...s, num: s.num, href: "/contact", cta: "Talk to us →" }))} />
      </ContentSection>
    </>
  );
}

/* Partner credentials and fuller descriptions for the technologies index —
 * the card grid promotes each partnership's proof points, not just a tagline. */
const PARTNER_CREDENTIALS: Record<string, { credential: string; body: string }> = {
  alteryx: {
    credential: "Authorised PS & Training Partner",
    body: "Analytics automation that retires spreadsheet-bound processes — clients have cut core reporting from 18 hours to 5 minutes. We implement, then train your analysts to self-sufficiency as an Authorised Training Partner.",
  },
  appian: {
    credential: "FS Partner of the Year 2024",
    body: "Low-code case management and customer-lifecycle automation, delivered as partners since 2019 — with Innovation Partner of the Year awards in 2020 and 2021 and certified lead developers on every engagement.",
  },
  databricks: {
    credential: "Certified architects & engineers",
    body: "Lakehouse implementations for enterprise data and AI — data contracts in Unity Catalog, petabyte-scale risk and transaction data, and QBricks streaming governed data products straight into the platform.",
  },
  "microsoft-fabric": {
    credential: "Early adopter · DP-700 certified",
    body: "Fabric and Azure data foundations for regulated workloads. Every engineer is DP-700 certified, and we run our own business on Fabric — so deployment advice comes from first-hand operation, not the datasheet.",
  },
  quantexa: {
    credential: "Plus Alliance Partner · 20+ projects",
    body: "Decision intelligence at bank scale — contextual monitoring for CDD, correspondent banking and fraud — with a Centre of Excellence, 20 solution experts and a 750+ question maturity assessment behind it.",
  },
};

export function TechnologiesWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="Technology partners"
        title="Technologies"
        body="Best-in-class fintech and platform technology partners across data, process automation, risk, regulation and control."
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionIntro eyebrow="Our partnerships" title="Best-in-class partners, long-standing relationships" />
          </div>
          <Reveal className="space-y-5 leading-relaxed text-ice md:col-span-7">
            <p>We work with a deliberately small set of best-in-class platform partners, relationships built over years of joint delivery, not badge-collecting. Our teams hold deep, certified expertise in each platform and have delivered complex programmes on them for the world&rsquo;s leading financial services firms: decision intelligence at bank scale, enterprise data engineering, and automation that takes core processes from weeks to minutes.</p>
            <p>That combination, proven platforms, practitioners who know them inside out, and packaged delivery patterns, is how we de-risk implementations and compress time to value.</p>
            <SecondaryLink href="/insights">Read the case studies →</SecondaryLink>
          </Reveal>
        </div>
        <div className="mt-14">
          <PartnerLogos tileClass="px-6 py-7" />
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="The partnerships" title="Certified depth on every platform we recommend" />
        <CardGrid
          items={TECHNOLOGIES.map((p) => ({
            title: p.name,
            eyebrow: PARTNER_CREDENTIALS[p.slug]?.credential,
            logo: (
              <div
                data-testid={`technology-card-logo-${p.slug}`}
                className="mt-4 flex h-12 items-center"
              >
                <TechnologyLogo slug={p.slug} decorative className="h-8" />
              </div>
            ),
            body: PARTNER_CREDENTIALS[p.slug]?.body ?? p.tagline,
            href: `/technologies/${p.slug}`,
            cta: `How we work with ${p.name} →`,
          }))}
        />
      </ContentSection>
      <CTASection title="Which platform fits your challenge?" body="We navigate the fintech landscape so you don't have to." label="Schedule a discussion" />
    </>
  );
}

const TECHNOLOGY_DETAIL: Record<string, {
  eyebrow: string;
  title: string;
  body: string;
  cards: Array<{ title: string; body: string }>;
  sections?: Array<{ title: string; items: Array<{ title: string; body: string }> }>;
  note?: string;
  links: Array<{ href: string; label: string }>;
  cta: string;
  /* client-facing proof points: case-study slugs delivered on this platform */
  caseStudies?: string[];
  /* in-the-field results wall: anonymised engagement outcomes with a
   * time-saved metric (source: client-supplied case-study deck, Jul 2026) */
  results?: {
    intro: { eyebrow: string; title: string; body: string };
    items: Array<{ tag: string; metric: string; metricLabel: string; title: string; body: string }>;
  };
  /* delivery-pattern cases: problem → what we provide → outcome, no metrics
   * (source: client-supplied designed case pages, Jul 2026) */
  fieldCases?: {
    intro: { eyebrow: string; title: string; body: string };
    items: Array<{ tag: string; title: string; problem: string; points: Array<[string, string]>; outcome: string }>;
  };
}> = {
  alteryx: {
    eyebrow: "Technologies",
    title: "How we work with Alteryx",
    body: "Self-service, unified, enterprise-grade analytics automation. As an Authorised Professional Services Partner and Authorised Training Partner, we deliver expert implementation and train your teams to become truly self-sufficient.",
    cards: [
      { title: "Retire the spreadsheet", body: "We replace end-user spreadsheet processes in finance, risk and operations with automated data workflows and full audit trails." },
      { title: "Reporting at pace", body: "Clients have cut core reporting processes from 18 hours to 5 minutes and moved from monthly to weekly cycles with Alteryx automation." },
      { title: "Enablement & training", body: "As an Authorised Training Partner we teach your analysts to streamline financial data processing, automate workflows and enhance analysis, without coding." },
    ],
    sections: [
      { title: "Alteryx projects", items: [
        { title: "Finance EUC elimination", body: "understanding and migrating Excel-based processes onto Alteryx for a FTSE250 insurance company" },
        { title: "IFRS17 cost allocation", body: "analysis and build of a cost allocation engine with sub-1-minute execution time" },
        { title: "Bordereau processing", body: "automation of manual reconciliations and approvals to cut effort and operational errors" },
        { title: "Faster close", body: "automating FX rate generation to remove half a day from month-end close" },
      ] },
      { title: "Our own developed assets", items: [
        { title: "Design pattern best practice", body: "common Excel problems catalogued to accelerate outcomes" },
        { title: "Release pipeline", body: "practical best practice for controlling deployment between environments" },
        { title: "Alteryx adoption", body: "a hands-on approach to technical and skills adoption" },
      ] },
    ],
    note: "We have not only delivered Alteryx projects, we have been buyers, sponsors and implementers of the platform inside major financial institutions.",
    links: [
      { href: "/technologies/alteryx-bootcamps", label: "Spotlight on Alteryx Bootcamps →" },
      { href: "/technologies", label: "← All technologies" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    cta: "Which process should Alteryx take off your hands?",
    caseStudies: ["regulatory-reporting", "finance-re-engineering", "capital-requirements"],
    results: {
      intro: {
        eyebrow: "In the field",
        title: "Eleven processes, hours back every month",
        body: "Recent automation engagements inside tier-1 banks in Turkey and the UAE: finance and risk processes taken from manual effort to governed, repeatable workflows.",
      },
      items: [
        { tag: "Finance · Turkey", metric: "2 hrs", metricLabel: "saved per month", title: "From manual reconciliation to automatic exception handling", body: "A legacy macro and line-by-line checking replaced by a workflow that auto-matches agreeing records, routes every mismatch to a review queue and reports the exceptions." },
        { tag: "Finance · Turkey", metric: "16 hrs", metricLabel: "saved per month", title: "From manual P&L extraction to instant daily reporting", body: "Daily P&L built from multiple trading-system screens now runs as one governed workflow — joins in seconds, unmatched datasets flagged for troubleshooting." },
        { tag: "Finance · UAE", metric: "8 days", metricLabel: "saved per month", title: "From days of RWA calculation to a 15-minute run", body: "RWA calculations across legacy systems and massive datasets — data tested first, then run in full — cut from days of error-prone manual work to a 15-minute run." },
        { tag: "Finance · UAE", metric: "6 hrs", metricLabel: "saved per month", title: "From memorised rules to an auditable variance engine", body: "Cost-variance logic once hardcoded across spreadsheets is now coded explicitly — transparent, auditable and easy to troubleshoot when something looks off." },
        { tag: "Finance · Turkey", metric: "4 hrs", metricLabel: "saved per month", title: "From manual screening to traceable sanctions matching", body: "Asset-freezing notices answered from unified data: standardised names and identifiers, risk-based escalation and clear supporting evidence for every match." },
        { tag: "Finance · Turkey", metric: "8 hrs", metricLabel: "saved per month, up to", title: "From scattered files to one governed BIST report", body: "Customer, usage and pricing files consolidated automatically against the current price list — a full audit trail from source to final payable figure." },
        { tag: "Finance · Turkey", metric: "4 hrs", metricLabel: "saved per month", title: "From blended AUM moves to a clear customer-vs-market bridge", body: "Monthly AUM movement decomposed automatically into customer-driven flows and market-value effects, product by product, period over period." },
        { tag: "Risk · Turkey", metric: "4 hrs", metricLabel: "saved per month", title: "From manual trade checks to automated FX reconciliation", body: "FX option trades matched against their London legs across every key attribute, with matches, gaps and exceptions prioritised for Operations." },
        { tag: "Risk · Turkey", metric: "4 hrs", metricLabel: "saved per month", title: "From fragmented pricing files to one central repository", body: "Pricing data from multiple systems standardised, matched on agreed keys and deduplicated into one governed central dataset." },
        { tag: "Risk · Turkey", metric: "4 hrs", metricLabel: "saved per month", title: "From manual NPL workbooks to a repeatable monthly workflow", body: "Monthly NPL ratios calculated in one workflow with consistent definitions, sector mapping and data-quality exceptions flagged for review." },
        { tag: "Risk · Turkey", metric: "12 hrs", metricLabel: "saved per month, up to", title: "From daily manual charting to one-click RMM packs", body: "Daily risk management and monitoring graphs rebuilt on demand from the latest data — no manual charting, no email assembly." },
      ],
    },
  },
  appian: {
    eyebrow: "Technologies",
    title: "How we work with Appian",
    body: "Appian is the only recognised triple crown leader in automation, low-code and case management. We build more powerful apps, dramatically increase productivity and significantly reduce costs on the platform, as partners since 2019.",
    cards: [
      { title: "Case management", body: "We consolidate fragmented processes into governed case-management frameworks, one client went from 15+ processes to a set of 7." },
      { title: "Customer lifecycle", body: "Onboarding, credit-risk and servicing workflows built on Appian, embedded into your existing architecture and data." },
      { title: "Recognised partnership", body: "FS Partner of the Year 2024 and Innovation Partner of the Year in both 2020 and 2021, with certified lead developers and long-standing relationships with Appian's senior leadership." },
    ],
    sections: [
      { title: "Appian projects", items: [
        { title: "Regulation mapping", body: "identification, triage and linking of regulatory obligations to the enterprise risk framework for a top-tier bank" },
        { title: "Private equity deal pipeline", body: "digitising and automating investment committee approval processes" },
        { title: "Transaction monitoring case management", body: "implementation of a financial-crime case management tool" },
        { title: "Insurance BPM", body: "front-to-back automation of legacy and manual processes at a leading London insurer" },
        { title: "Credit & lending", body: "commercial bank loan origination and credit system implementation" },
      ] },
      { title: "Our own developed assets", items: [
        { title: "Quantexa / Appian integration", body: "contextual search embedded within an Appian KYC workflow with risk-based decisioning" },
        { title: "Model Risk Manager", body: "model lifecycle management for the model oversight committee, available on the Appian App Market" },
        { title: "Process workbench", body: "execution and maintenance of process run-books for large-scale outcomes such as month end" },
        { title: "New business process", body: "tracking the creation, analysis, approval and execution of new business initiatives" },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    cta: "Have a process that needs a platform?",
  },
  databricks: {
    eyebrow: "Technologies",
    title: "How we work with Databricks",
    body: "Every decision in financial services depends on data, managing risk, complying with regulation, creating exceptional client experiences. We help you transform your data estate with the Databricks Lakehouse Platform and accelerate your A.I. journey.",
    cards: [
      { title: "Unified data management", body: "Data contracts in the Databricks Unity Catalog, all of your data, its lineage and its governance in one place, ready for regulatory reporting." },
      { title: "Scalability", body: "Petabytes of transaction, market and client data, structured and unstructured, handled with ease on a single lakehouse platform." },
      { title: "Advanced analytics & AI", body: "Once you are in control of your data, we help you build on it, from credit risk modelling and fraud detection to information-led intelligence." },
    ],
    sections: [
      { title: "Our Databricks services", items: [
        { title: "Data strategy & architecture", body: "certified Databricks architects aligning the platform with your business priorities, secure, compliant and future-ready" },
        { title: "Lakehouse implementation", body: "building and optimising environments that unify fragmented data systems for real-time, actionable insight" },
        { title: "AI & machine learning", body: "from credit risk modelling to fraud detection and operational efficiency" },
        { title: "Regulatory & ESG reporting", body: "including our CSRD reporting solution combining Databricks and Alteryx" },
        { title: "Capability building", body: "training your teams for self-sufficiency and lasting benefit from the investment" },
      ] },
      { title: "Engineered solutions", items: [
        { title: "QBricks", body: "streams governed, contract-enforced data products straight into your lakehouse, A.I.-ready in hours, not years" },
        { title: "QBricks data quality", body: "built-in data quality validation that significantly improves data quality and reduces the need for large cleansing teams" },
      ] },
    ],
    note: "We aim to make the best — Databricks — better still: certified experts focused where they add most value, with engineered solutions doing the generic work.",
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions/qbricks", label: "Explore QBricks →" },
    ],
    cta: "Is your lakehouse working as hard as it should?",
    caseStudies: ["big-data-engineering", "data-strategy", "climate-reporting"],
  },
  "microsoft-fabric": {
    eyebrow: "Technologies",
    title: "How we work with Microsoft Fabric & Azure",
    body: "Data should do more than sit in silos, it should fuel smarter decisions and support your A.I. agenda. All of our engineers are DP700 certified; we were an early adopter of Fabric and run our entire business on it.",
    cards: [
      { title: "Strategy, architecture & planning", body: "Clear strategies for data governance, migrations and integrations, with guidance on scalable architectures. We know what works, and what doesn't, so plans are realistic and deliver the benefits promised." },
      { title: "Fabric implementation", body: "A generic \"get it done\" deployment results in longer-term pain: costly, non-performant, unable to scale. We use deep Fabric knowledge to make deployments scalable and effective for the use cases that matter to you." },
      { title: "Azure data solutions", body: "Certified Azure engineers designing and building cloud-native data architectures, secure, scalable and cost-effective, with extra leverage where Dynamics 365 F&O or CE is already deployed." },
    ],
    sections: [
      { title: "Bespoke solutions", items: [
        { title: "Not your average Fabric partner", body: "We combine deep engineering expertise with first-hand Fabric experience, delivering bespoke solutions for specific client problems. Once Fabric is deployed, we tackle data quality head-on, for example deploying Quantexa Unify as a workload package so data is entity-resolved across the Fabric estate, and streaming governed, A.I.-ready data products into Fabric with QBricks via SQL push-down." },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions/qbricks", label: "Explore QBricks →" },
    ],
    cta: "Planning a Fabric or Azure move?",
    caseStudies: ["fintech-transformation"],
    fieldCases: {
      intro: {
        eyebrow: "Delivery patterns",
        title: "From source to defensible decisions: three Fabric builds",
        body: "What we provide when delivering with Microsoft Fabric, shown through three focused builds — every engineer DP-700 certified, every build governed from the first pipeline.",
      },
      items: [
        {
          tag: "Data platform",
          title: "One governed pipeline from source to report",
          problem: "Company data lives everywhere — CRM, HR, finance, project tools — and each system tells only part of the story.",
          points: [
            ["One medallion architecture", "OneLake brings every source into one place: one copy of the data, checked, cleaned and governed on the way in."],
            ["No-code to pro-code", "From Data Factory pipelines to Spark notebooks, tooling is built into standardised, reusable patterns."],
            ["Reports for every department", "The same governed copy of the data feeds Power BI reports across the business, so everyone works from the full story."],
            ["Governance built in", "Lineage, sensitivity labels and access control cover the whole platform, not just the data."],
          ],
          outcome: "The full story, always up-to-date and accurate, from source to report.",
        },
        {
          tag: "Risk & compliance",
          title: "Know your customer, in real time",
          problem: "Customer data is fragmented across systems; keeping KYC current is expensive and error-prone.",
          points: [
            ["One view, updated in real time", "Customer data from every system flows into a single, always-current picture — no more stitching together fragments at review time."],
            ["Reviews triggered the moment something changes", "Real-Time Intelligence monitors streaming data and triggers a review as soon as a customer's circumstances change."],
            ["Protected and traceable with Purview", "Every attribute is classified, protected and traceable back to its source. The audit trail comes with the platform."],
          ],
          outcome: "From periodic reviews to continuous assurance, with the audit trail built in.",
        },
        {
          tag: "Risk modelling",
          title: "Risk models you can audit",
          problem: "Credit risk models are only as good as the data behind them, and regulators expect to see the working, not just the score.",
          points: [
            ["Built directly on OneLake", "Models are built with Data Science tooling on one data pool: no copies, no handovers, no drift between training data and the source of truth."],
            ["Every version on record", "Each model version is stored in the model registry with its performance metrics and parameters, ready for review at any time."],
            ["Full traceability", "From source data to risk model, the working is there to show, not just the score."],
          ],
          outcome: "Defensible risk models, from training data to production.",
        },
      ],
    },
  },
  quantexa: {
    eyebrow: "Technologies",
    title: "How we work with Quantexa",
    body: "Transform your business with decision intelligence, reimagine how you drive your business, reduce risk and serve customers. Our Quantexa Centre of Excellence supports three core, integrated services.",
    cards: [
      { title: "Platform delivery", body: "Engineers, tech leads and architects implementing out-of-the-box features and tailored solutions, a structured approach from proof of concept through full use-case implementation, with co-delivery that creates a culture of acceleration." },
      { title: "Sustained support", body: "Empowering your transition to a self-sustaining Centre of Excellence: tuning assessments, optimisation strategy and remediation (entity resolution, scoring tuning), plus timely adoption of new platform features." },
      { title: "Upskilling", body: "A masterclass library of SME knowledge, active 1-to-1 and team coaching tailored to your maturity strategy, and continuous assessment to cultivate a highly skilled Quantexa team." },
    ],
    sections: [
      { title: "Achieving self-sufficiency", items: [
        { title: "Four steps to a self-reliant Quantexa team", body: "20+ Projects · 20 Solution experts" },
        { title: "Maturity evaluation", body: "Our maturity assessment framework evaluates your organisation against extensive technical and business criteria, whether you are new to Quantexa or established." },
        { title: "Capability planning", body: "A strategic approach to resource allocation, with tailored experience and learning pathways for critical areas." },
        { title: "Capability building", body: "Clear objectives, an activity roadmap and continuous monitoring to track progress, achievements and milestones." },
        { title: "Self-sufficiency", body: "Greater self-reliance and reduced dependence on external service providers, with better and faster outcomes." },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions/quantexa-maturity-assessment", label: "Quantexa maturity assessment →" },
    ],
    cta: "How mature is your Quantexa estate?",
    caseStudies: ["tbml-detection"],
  },
};

export function TechnologyDetailPage({ slug }: { slug: string }) {
  const t = TECHNOLOGY_DETAIL[slug];
  if (!t) notFound();
  return (
    <>
      <HeroSection
        eyebrow={t.eyebrow}
        title={t.title}
        body={t.body}
        brand={
          /* the partnership credential, worn as a badge (client, 23 Aug) */
          <div className="flex flex-col items-start gap-4">
            {slug === "quantexa" ? <TechnologyLogo slug="quantexa" decorative className="h-8 sm:h-10" sizes="220px" /> : null}
            {PARTNER_CREDENTIALS[slug] ? (
              <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-4 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <span aria-hidden className="size-1.5 rounded-full bg-signal shadow-[0_0_0_4px_rgba(35,79,189,0.08)]" />
                {PARTNER_CREDENTIALS[slug].credential}
              </span>
            ) : null}
          </div>
        }
      />
      <ContentSection>
        <NumberedCards items={t.cards} />
        <div className="mt-10 flex flex-wrap gap-6">
          {t.links.filter((l) => l.label.includes("Spotlight")).map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
        {t.sections?.map((s) => (
          <div key={s.title} className="mt-14">
            <h2 className="text-(length:--text-step-2)">{s.title}</h2>
            <div className="mt-6 divide-y divide-ice/12 border-y hairline">
              {s.items.map((item) => (
                <article key={`${s.title}-${item.title}`} className="grid gap-3 py-5 md:grid-cols-12">
                  <h3 className="text-(length:--text-step-1) md:col-span-4">{item.title}</h3>
                  <p className="text-ice md:col-span-8">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
        {t.note ? <p className="mt-10 max-w-3xl text-(length:--text-step-1) text-glass">{t.note}</p> : null}
        <div className="mt-10 flex flex-wrap gap-6">
          {t.links.filter((l) => !l.label.includes("Spotlight")).map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
      </ContentSection>
      {slug === "quantexa" ? (
        <ContentSection className="bg-abyss/20">
          <SectionIntro eyebrow="The partnership" title="Better together" />
          <Reveal>
            <QuantexaFilm />
          </Reveal>
        </ContentSection>
      ) : null}
      {t.results ? (
        <ContentSection className="bg-abyss/20">
          <SectionIntro eyebrow={t.results.intro.eyebrow} title={t.results.intro.title} body={t.results.intro.body} />
          <Reveal className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {t.results.items.map((r) => (
              <article key={r.title} className="flex h-full flex-col border hairline bg-white/82 p-6 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
                <p className="eyebrow text-steel">{r.tag}</p>
                <p className="mt-4 font-display text-(length:--text-step-3) leading-none text-paper">
                  {r.metric}
                  <span className="ml-2 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{r.metricLabel}</span>
                </p>
                <h3 className="mt-4 text-(length:--text-step-1) leading-tight">{r.title}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{r.body}</p>
              </article>
            ))}
          </Reveal>
        </ContentSection>
      ) : null}
      {t.fieldCases ? (
        <ContentSection className="bg-abyss/20">
          <SectionIntro eyebrow={t.fieldCases.intro.eyebrow} title={t.fieldCases.intro.title} body={t.fieldCases.intro.body} />
          <div className="space-y-px">
            {t.fieldCases.items.map((c) => (
              <Reveal key={c.title}>
                <article className="grid gap-x-10 gap-y-6 border hairline bg-white/82 p-7 sm:p-9 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="eyebrow text-signal">{c.tag}</p>
                    <h3 className="mt-4 text-(length:--text-step-2) leading-tight">{c.title}</h3>
                    <p className="mt-4 leading-relaxed text-ice">{c.problem}</p>
                    <p className="mt-6 border-l-2 border-cobalt pl-4 text-(length:--text-body-sm) leading-relaxed text-glass">{c.outcome}</p>
                  </div>
                  <div className="md:col-span-8">
                    <p className="eyebrow text-steel">What we provide</p>
                    <div className="mt-3 divide-y divide-ice/12">
                      {c.points.map(([pt, pb]) => (
                        <div key={pt} className="grid gap-2 py-4 md:grid-cols-12 md:gap-6">
                          <h4 className="text-(length:--text-body) leading-snug md:col-span-4">{pt}</h4>
                          <p className="text-(length:--text-body-sm) leading-relaxed text-ice md:col-span-8">{pb}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </ContentSection>
      ) : null}
      {t.caseStudies?.length ? (
        <ContentSection className={t.results || t.fieldCases ? undefined : "bg-abyss/20"}>
          <SectionIntro eyebrow="Proof, not promises" title="Measured outcomes delivered on this platform" />
          <div className={`grid gap-px ${t.caseStudies.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {t.caseStudies.map((slug) => {
              const c = caseStudy(slug);
              return c ? <CaseStudyCard key={slug} c={c} /> : null;
            })}
          </div>
        </ContentSection>
      ) : null}
      <CTASection title={t.cta} label="Schedule a discussion" />
    </>
  );
}

export function AlteryxBootcampsPage() {
  return (
    <>
      <HeroSection
        backHref="/technologies/alteryx"
        backLabel="Alteryx"
        eyebrow="Spotlight"
        title="Alteryx Bootcamps"
        body="Intensive, hands-on training that takes your analysts from spreadsheet dependence to governed, self-service analytics, delivered by an Alteryx Authorised Training Partner."
      />
      <ContentSection>
        <SectionIntro eyebrow="The format" title="Learn by building, on your own data" />
        <NumberedCards items={[
          { title: "Foundation Bootcamp", body: "Five days. Workflow fundamentals through advanced preparation, macros, apps and governed deployment patterns, building towards Alteryx certification, participants leave having automated a real process from their own desk." },
          { title: "Finance bootcamp", body: "Tailored for finance functions: month-end automation, reconciliations and regulatory reporting patterns drawn from our real engagements." },
          { title: "Risk bootcamp", body: "Tailored for risk functions: risk data aggregation, control testing, monitoring and model input preparation, built on real engagement patterns." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Why it works" title="Built for self-sufficiency" />
        <NumberedCards columns={4} items={[
          { title: "Your data, not sample data.", body: "Exercises are built on your own processes, so the bootcamp ends with working automations, not just certificates." },
          { title: "Practitioners as trainers.", body: "Led by consultants who deliver Alteryx engagements in financial services every week, drawing on our design-pattern playbooks." },
          { title: "Governance from day one.", body: "Release pipelines, documentation standards and controls are built into every exercise, so what your team builds is auditable." },
          { title: "Post-bootcamp coaching.", body: "Structured follow-up sessions embed the skills and keep momentum after the classroom ends." },
        ]} />
      </ContentSection>
      <CTASection title="Book a bootcamp for your team" body="Delivered on site or remotely, tailored to your processes and data." />
    </>
  );
}

export function InsightsWirePage() {
  const testimonials = [
    { headline: "From 18 hours to 5 minutes", quote: "One of our core processes was reduced from 18 hours to 5 minutes through Alteryx automation and the fantastic support the team provided.", who: "Cost Management Team", org: "Global universal bank" },
    { headline: "12 hours of savings per month", quote: "A successful rollout of Alteryx in finance has saved around 12 hours a month for our operational reporting, moving us from monthly to weekly reporting.", who: "Global Sales Effectiveness Manager", org: "Global universal bank" },
    { headline: "4 weeks to 5 minutes", quote: "Key regulatory reporting process times went from 4 weeks down to just 5 minutes, with a single source of trading data now leveraged for further reporting.", who: "EMEA Process Owner", org: "Tier-1 global bank" },
    { headline: "An ESG solution in under 3 months", quote: "An enterprise-viable ESG reporting solution delivered in just over 8 weeks, engineered to scale across 12 business areas.", who: "Transformation Lead, Finance & Risk", org: "Leading bank" },
    { headline: "A digital platform in 8 weeks", quote: "Our alternatives investment process was digitised in less than 3 months, creating an end-to-end deal platform we now show to our clients.", who: "CTO", org: "Leading PE firm" },
    { headline: "A 5-year strategy in 3 months", quote: "The specialist team hit the ground running and delivered our 5-year technology strategy in less than 3 months.", who: "Group CIO", org: "Leading digital insurer" },
  ];
  return (
    <>
      <HeroSection
        eyebrow="Client work"
        title="Case studies"
        body="We leverage industry expertise together with the world's leading decision intelligence, data and automation technologies to deliver enterprise business solutions and transformation faster, cheaper and more effectively."
      />
      <ContentSection>
        <SectionIntro
          title="Weeks to minutes, years to months: the results our clients keep"
          body="Our clients have implemented AI and data-driven decisioning, automated processes from weeks to minutes, accelerated solution development by 8–10 times and saved months from transformation timelines."
        />
        <CaseStudyExplorer />
      </ContentSection>
      <CTASection title="Focus your strategy, set your plan and modernise your financial services business." href="/services" label="Our services" />
      <ContentSection>
        <SectionIntro eyebrow="Testimonials" title="What do our clients say?" />
        <div className="grid gap-px md:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.headline} className="border hairline bg-abyss/25 p-7">
              <p className="font-display text-(length:--text-step-4) text-signal">“</p>
              <h3 className="mt-2 text-(length:--text-step-1)">{t.headline}</h3>
              <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{t.quote}</p>
              <div className="mt-6 border-t hairline pt-4">
                <p className="text-(length:--text-body-sm) text-paper">{t.who}</p>
                <p className="eyebrow mt-1">{t.org}</p>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
    </>
  );
}

/* Split out of the case-studies page (client review, 20 Aug): buyers scan
 * case studies; internal thinking lives here under its own address. */
export function PerspectivesPage() {
  return (
    <>
      <HeroSection
        eyebrow="News & perspectives"
        title="What we're seeing in the market"
        body="Perspectives from our practice leads and R&D teams — the regulation, platforms and delivery patterns shaping regulated finance."
      />
      <ContentSection>
        <Reveal className="divide-y divide-ice/12 border-y hairline">
          {/* TODO(wireframe): perspective detail pages and destinations were not supplied. */}
          {PERSPECTIVES.map(([tag, title]) => (
            <div key={title} className="grid gap-4 py-5 md:grid-cols-[200px_1fr_auto] md:items-baseline">
              <p className="eyebrow">{tag}</p>
              <h3 className="text-(length:--text-step-1)">{title}</h3>
              <span className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel">Perspective</span>
            </div>
          ))}
        </Reveal>
      </ContentSection>
      <CTASection title="Talk these through against your own agenda" body="A free goals review with a practice lead — you leave with a concrete plan, whether or not you work with us." label="Speak to an expert" />
    </>
  );
}

export function CaseStudyWirePage({ slug }: { slug: string }) {
  const c = caseStudy(slug);
  if (!c) notFound();
  return (
    <>
      <HeroSection
        backHref="/insights"
        backLabel="All case studies"
        eyebrow={`Case study — ${c.service} · ${c.sector} · ${c.location}`}
        title={c.title}
        body={c.summary}
      />
      <ContentSection density="compact">
        <StatGrid stats={c.stats} />
      </ContentSection>
      <ContentSection density="compact">
        <CaseStudyVisual study={c} />
      </ContentSection>
      <ContentSection>
        <div className="grid gap-px md:grid-cols-3">
          {[
            ["The challenge", c.challenge],
            ["Our approach", c.approach],
            ["The outcome", c.outcome],
          ].map(([title, list], index) => (
            <article
              key={title as string}
              className={`relative overflow-hidden border p-7 ${
                index === 2 ? "border-signal/35 bg-abyss/45" : "hairline bg-abyss/25"
              }`}
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-px ${index === 2 ? "bg-signal" : "bg-ice/12"}`} />
              <p className="eyebrow text-signal">0{index + 1}</p>
              <h2 className="mt-4 text-(length:--text-step-2)">{title as string}</h2>
              <ul className="mt-6 space-y-4">
                {(list as string[]).map((item) => (
                  <li key={item} className="flex gap-4 text-(length:--text-body-sm) leading-relaxed text-ice">
                    <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Related" title="More case studies" />
        <div className="mb-8"><SecondaryLink href="/insights">View all case studies →</SecondaryLink></div>
        <div className="grid gap-px md:grid-cols-3">
          {c.related.map((slug) => {
            const r = caseStudy(slug)!;
            return <CaseStudyCard key={slug} c={r} />;
          })}
        </div>
      </ContentSection>
      <CTASection title="Facing a similar challenge? Talk to the team that has done this before." />
    </>
  );
}

/* ---- About and adjacent pages ----------------------------------------- */

export function AboutWirePage() {
  /* names, roles and bios sourced from nxwave.com/locations/infinium-amsterdam-en */
  const leadership = [
    ["David Aston", "CEO, Infinium", "david-aston-v2", "30+ years in financial markets, founder of the NextWave Group and CEO & founder of Infinium. Has delivered complex transformation inside tier-1 banks."],
    ["Toby Smith-Cullen", "Partner, Infinium", "toby-smith-cullen", "Twenty years in transformation and innovation in the financial industry, formerly fintech partnership lead at a leading Dutch bank. MSc, Delft University of Technology."],
    ["Erik Rowbotham", "Partner, Infinium", "erik-rowbotham", "Regulation & Compliance practice lead. Change delivery leader with an accounting and business background, built inside major UK banking institutions."],
    ["Helen Bull", "Partner, Infinium", "helen-bull", "Leads the Transformation practice, operating at board level with large corporate and financial services clients across the UK, Germany and the Netherlands. Certified project manager."],
    ["Jeanette Zeilmaker", "Operations Head, Infinium", "jeanette-zeilmaker", "Head of operations for Infinium in the Netherlands — 20 years across operations, HR, contract management and compliance."],
  ] as const;

  return (
    <>
      <HeroSection
        eyebrow="Who we are"
        title="It's all about business outcomes"
        body="We have stood in the same shoes as our clients. Everything we do is about helping our clients succeed."
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow text-signal">Our firm</p>
            <h2 className="mt-6 text-(length:--text-step-3)">Industry practitioners at our core</h2>
            <p className="mt-6 leading-relaxed text-ice">Our leadership team are hands-on MD-level practitioners from major global financial services firms, with deep experience of the same challenges our clients face. Delivery teams pair seasoned industry specialists with dynamic new talent.</p>
            <p className="mt-5 leading-relaxed text-ice">Together with best-in-class fintech and platform partners, we deliver unique business solutions with the latest enabling technologies, helping our clients go faster.</p>
          </Reveal>
          <div className="grid grid-cols-4 gap-px overflow-hidden border hairline bg-ice/12" aria-label="Infinium leadership team">
            <Image
              src="/img/team-david-v2.avif"
              alt="David Aston, Chief Executive Officer"
              width={800}
              height={800}
              sizes="(min-width: 768px) 25vw, 50vw"
              className="col-span-2 row-span-2 h-full w-full object-cover grayscale"
            />
            {leadership.slice(1).map(([name, role, img]) => (
              <Image
                key={name}
                src={`/img/team/${img}.webp`}
                alt={`${name} — ${role}`}
                width={600}
                height={600}
                loading="lazy"
                sizes="(min-width: 768px) 12.5vw, 25vw"
                className="aspect-square h-full w-full object-cover grayscale"
              />
            ))}
          </div>
        </div>
      </ContentSection>
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-[380px_1fr]">
          <figure className="overflow-hidden border hairline bg-abyss/25">
            <Image
              src="/img/team-david-v2.avif"
              alt="David Aston, Chief Executive Officer"
              width={800}
              height={800}
              loading="lazy"
              sizes="(min-width: 768px) 380px, 100vw"
              className="h-full min-h-[28rem] w-full object-cover grayscale"
            />
          </figure>
          <Reveal>
            <p className="eyebrow text-signal">Founder</p>
            <h2 className="mt-6 text-(length:--text-step-3)">David Aston, Chief Executive Officer</h2>
            <p className="mt-6 leading-relaxed text-ice">Banks, asset managers and insurers today grapple with exponential data growth, financial crime prevention, evolving ESG mandates and rising regulatory pressure, while slow systems and siloed data cost them agility and put compliance at risk. Infinium exists to solve these challenges.</p>
            <p className="mt-5 leading-relaxed text-ice">David founded Infinium Consulting, a Top-5 Best Place to Work, where a Netherlands-based team of 40+ experts helps banks across Europe, the Nordics and the Middle East harness big data and AI to meet CSRD, DORA and ESG demands.</p>
            <p className="mt-5 leading-relaxed text-ice">With over 30 years in financial markets, as partner or founder at Infinium, m.a.partners, avantage and NextWave Group, David has delivered mission-critical merger integrations, Brexit transitions and transformations for tier-1 banks worldwide. David is a TEDx speaker and sponsor and founder of One4One, an internship programme supporting young talent.</p>
            <p className="mt-8"><PrimaryLink href="/contact">Speak to an expert</PrimaryLink></p>
          </Reveal>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Management team" title="Leadership" body="Hands-on practitioners from major global financial services firms, leading from Amsterdam and Dubai." />
        {/* portraits + roles sourced from nxwave.com/locations/infinium-amsterdam-en */}
        {/* five people, three columns: equal-width cards with the two-card
            final row centred, not stretched */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-6">
          {leadership.map(([name, role, img, bio], i) => (
            <article key={name} className={`border hairline bg-abyss/25 p-6 lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""}`}>
              <Image
                src={`/img/team/${img}.webp`}
                alt={`${name} — ${role}`}
                width={600}
                height={600}
                loading="lazy"
                sizes="(min-width: 1024px) 170px, (min-width: 640px) 28vw, 45vw"
                className="aspect-square w-full max-w-[170px] border hairline object-cover grayscale"
              />
              <h3 className="mt-5 text-(length:--text-body)">{name}</h3>
              <p className="eyebrow mt-2">{role}</p>
              <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{bio}</p>
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection density="compact">
        <SectionIntro
          eyebrow="Life here"
          title="The firm, off the slide deck"
          body="Two hubs, one team. A look at how it actually feels to work here."
        />
        <p className="-mt-4 mb-2">
          <SecondaryLink href="/about/culture">More about our culture →</SecondaryLink>
        </p>
      </ContentSection>
      <PhotoCollage shots={CULTURE_COLLAGE} label="Life at Infinium, in pictures" />

      <ContentSection>
        <SectionIntro eyebrow="Locations" title="Where you'll find us" body="We serve clients across the EU, Nordic and Middle East (GCC) markets from our two hubs." />
        <Reveal className="grid gap-px md:grid-cols-2">
          {([
            ["ams-exterior", "Amsterdam, The Netherlands", "Infinium Consulting B.V., head office", "/about/amsterdam", "Our building at Fred Roeskestraat 115, Amsterdam"],
            ["dxb-innovationone", "DIFC, Dubai", "Infinium Technology Ltd, Middle East", "/about/dubai", "Innovation One in the Dubai International Financial Centre"],
          ] as const).map(([slot, title, body, href, alt]) => (
            <Link
              key={slot}
              href={href}
              className="spot group relative block h-full overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_34px_rgba(23,56,102,0.075)] focus-visible:border-signal/60 focus-visible:bg-white"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              <div className="overflow-hidden">
                <GlassImage
                  image={siteImage(slot)}
                  alt={alt}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  imageClassName="aspect-[16/10] object-cover transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                />
              </div>
              <div className="border-t hairline p-7">
                <h3 className="text-(length:--text-step-1) leading-tight">{title}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
                <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Visit this office →</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </ContentSection>
      <CTASection title="Join the team" body="We are a values-led firm built from seasoned professionals and dynamic new talent." href="/careers" label="Your career" />
    </>
  );
}

/* the ribbon that runs under the culture and careers stories */
/* Deliberately shares no photograph with the captioned mosaic on the culture
 * page — the collage carries the candid half of the set, the mosaic the
 * composed half. Order matters: PhotoCollage's rhythm is hand-tuned for
 * exactly these six entries (wide+tall pair, then a row of three, then a
 * full-width closer) — adding, removing or reordering an entry without
 * updating RHYTHM in PhotoCollage.tsx will leave a gap in the grid. */
const CULTURE_COLLAGE: readonly CollageShot[] = [
  { slot: "culture-lounge", alt: "The team together in the Amsterdam lounge", caption: "The Amsterdam lounge" },
  { slot: "culture-toast", alt: "Colleagues celebrating together", caption: "Celebrating together" },
  { slot: "culture-harbour", alt: "Summer drinks by the harbour", caption: "Summer by the harbour" },
  { slot: "culture-night", alt: "The team on a night out", caption: "A night out" },
  { slot: "culture-onthe-road", alt: "Colleagues travelling between the hubs", caption: "Between the hubs" },
  { slot: "culture-yearend", alt: "The team in the Amsterdam hub, spring 2026", caption: "In the Amsterdam hub", position: "50% 30%" },
] as const;
/* culture-standup moved to the Alteryx Bootcamps page, culture-offsite to
 * the One4One/social-responsibility page — see AlteryxBootcampsPage and
 * SocialResponsibilityPage below. */

export function InfiniumLabsPage() {
  return (
    <>
      <HeroSection
        backHref="/about"
        backLabel="About us"
        eyebrow="Infinium Labs"
        title="Products built by people who've run your systems."
        body="Infinium Labs is Infinium's engineering and product team, a single unit collaborating across Amsterdam and Dubai, turning hands-on financial services delivery experience into engineered software."
        actions={[
          { href: "/solutions", label: "Explore the products" },
          { href: "/contact", label: "Talk to the team →" },
        ]}
        stats={[
          { value: "2", label: "Labs — Amsterdam & DIFC, Dubai" },
          { value: "1 live", label: "QBricks, in production today" },
          { value: "1 next", label: "VBricks, coming soon" },
        ]}
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionIntro eyebrow="The team" title="Bank-side experience, engineering-grade credentials" />
          </div>
          <Reveal className="space-y-5 leading-relaxed text-ice md:col-span-7">
            <p>The team&rsquo;s collective background spans tier-1 banks and asset managers, including ABN AMRO, ING, APG Asset Management and MSCI, alongside research posts at the Australian National University and Eindhoven University of Technology. Between them, the team has led cloud data platform migrations, built automated model-testing solutions for wholesale and business banking credit risk models, and worked as technical consultants to the market for over a decade.</p>
            <p>The team is small by design and structured so that engineers who have sat inside a bank&rsquo;s risk, data or technology function build the tools other banks now use to solve the same problems: there&rsquo;s no separation between the people who understand the industry and the people who write the code. The Amsterdam and Dubai arms operate as one unit, sharing standards, tooling and delivery discipline across both locations.</p>
          </Reveal>
        </div>
        <div className="mt-12">
          <NumberedCards
            columns={3}
            items={[
              { title: "Practitioners first", body: "Experience drawn from inside ABN AMRO, ING, APG Asset Management and MSCI, hands-on, outcome-led and close to the client problem, with over a decade as technical consultants to the market." },
              { title: "Calibre that's hard to combine", body: "A PhD in Computer Science, postdoctoral research in artificial intelligence, and industry certifications including Azure Databricks Platform Architect and Microsoft Fabric Data Engineer Associate. Automated testing designed and implemented across more than 20 credit risk models." },
              { title: "Research, applied", body: "A PhD from the Australian National University, a Master of Research in Computer Science, postgraduate study in AI and high-performance computing, and business education from RSM Erasmus and Frankfurt School, translated directly into product engineering rather than left on the page." },
            ]}
          />
        </div>
      </ContentSection>
      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="The product suite" title="One suite, two products, one goal: cheaper, faster data estates" />
        <div className="grid gap-px lg:grid-cols-2">
          <article className="border hairline bg-white/78 p-8 shadow-[0_12px_34px_rgba(23,56,102,0.055)] md:p-10">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-(length:--text-step-2)"><QBricksWord /></h3>
              <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-3 font-mono text-[10px] uppercase tracking-[0.08em] text-signal">
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                Live
              </span>
            </div>
            <p className="mt-4 text-(length:--text-step-1) text-glass">Governed, A.I.-ready data products in hours.</p>
            <p className="mt-5 leading-relaxed text-ice">Designed and developed in the Amsterdam lab. Streams data from systems of record into contract-governed products on Databricks, Fabric, Snowflake or your own database.</p>
            <p className="mt-7"><SecondaryLink href="/solutions/qbricks">Explore QBricks →</SecondaryLink></p>
          </article>
          <article className="border hairline bg-white/78 p-8 shadow-[0_12px_34px_rgba(23,56,102,0.055)] md:p-10">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="font-hero text-(length:--text-step-2) font-semibold tracking-[-0.025em] text-paper">VBricks</h3>
              <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-signal/25 bg-signal/[0.06] px-3 font-mono text-[10px] uppercase tracking-[0.08em] text-signal">
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                Coming soon
              </span>
            </div>
            <p className="mt-4 text-(length:--text-step-1) text-glass">Model validation from weeks to a repeatable run.</p>
            <p className="mt-5 leading-relaxed text-ice">Designed and developed in the DIFC, Dubai lab. Automated test packs, challenger comparisons and complete evidence trails for credit, KYC, fraud and AML models.</p>
            <p className="mt-7"><SecondaryLink href="/solutions/vbricks">Explore VBricks →</SecondaryLink></p>
          </article>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Two labs, one practice" title="Amsterdam builds the data engine, Dubai builds the validator" />
        <Reveal className="grid gap-px md:grid-cols-2">
          {([
            ["ams-exterior", "Amsterdam lab", "Home of QBricks. The Netherlands team owns the data-engine roadmap: streaming ingestion, contract enforcement and agentic metadata.", "/about/amsterdam", "Our building at Fred Roeskestraat 115, Amsterdam"],
            ["dxb-innovationone", "DIFC, Dubai lab", "Home of VBricks, based in Innovation One. Supported by the UAE government to design, develop and deliver AI-focused solutions.", "/about/dubai", "Innovation One in the Dubai International Financial Centre"],
          ] as const).map(([slot, title, body, href, alt]) => (
            <Link
              key={slot}
              href={href}
              className="spot group relative block h-full overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_34px_rgba(23,56,102,0.075)] focus-visible:border-signal/60 focus-visible:bg-white"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              <div className="overflow-hidden">
                <GlassImage
                  image={siteImage(slot)}
                  alt={alt}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  imageClassName="aspect-[16/10] object-cover transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                />
              </div>
              <div className="border-t hairline p-7">
                <h3 className="text-(length:--text-step-1) leading-tight">{title}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
                <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Visit this office →</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </ContentSection>
      <CTASection
        title="See what the Labs could take off your roadmap"
        body="A working session with the product team — bring a data or validation problem, leave with an engineered answer."
        label="Book a Labs session"
      />
    </>
  );
}

export function CulturePage() {
  return (
    <>
      <HeroSection
        eyebrow="Who we are"
        title="Our culture"
        body="An international firm by design. Our people come from across Europe, the Middle East and beyond, working in multiple languages across two hubs, and bringing the perspective of the world's financial centres to every engagement."
        stats={[
          { value: "15+", label: "Nationalities" },
          { value: "10+", label: "Languages spoken" },
          { value: "2", label: "Hubs, Amsterdam & Dubai" },
          { value: "3", label: "Regions served, EU, Nordics, GCC" },
        ]}
      />
      <ContentSection>
        <SectionIntro eyebrow="International by design" title="Local language, local context, global standards" />
        <Reveal className="max-w-3xl space-y-5 leading-relaxed text-ice">
          <p>Our clients operate across borders, so do we. Engagement teams work in the client&rsquo;s language wherever we can, Dutch, English, Hindi, Spanish, Italian, French, German and more, and always with an understanding of the local regulatory and business context.</p>
          <p>Serving the EU, Nordic and GCC markets from Amsterdam and Dubai means our people move between cultures daily. That fluency is a professional skill we hire for and develop, not an afterthought.</p>
        </Reveal>
      </ContentSection>

      {/* the whole firm, full bleed — the one moment on this page that
          breaks the container and lets the photography carry the story */}
      <section aria-label="The Infinium team" className="relative border-t hairline">
        <GlassImage
          image={siteImage("culture-terrace")}
          alt="The Infinium team together on the terrace"
          sizes="100vw"
          imageClassName="aspect-[16/10] object-cover md:aspect-[21/9]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-overlay/80 via-overlay/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-(--container-content) px-(--spacing-gutter) pb-8 md:pb-12">
          <p className="eyebrow text-on-dark-accent">All of us</p>
          <p className="mt-3 max-w-2xl text-(length:--text-step-2) leading-tight text-on-dark">
            One firm, two hubs, fifteen nationalities.
          </p>
        </div>
      </section>

      <PhotoCollage shots={CULTURE_COLLAGE} label="Life at Infinium, in pictures" />

      <ContentSection>
        <SectionIntro eyebrow="What shapes us" title="The values behind the work" />
        <NumberedCards items={[
          { title: "One team, two hubs", body: "Amsterdam and Dubai operate as a single practice: shared playbooks, shared R&D, one quality bar. People move between hubs and engagements freely." },
          { title: "Seniors alongside new talent", body: "MD-level practitioners work directly with graduates, interns and One4One participants, apprenticeship in the real sense, on live engagements." },
          { title: "Difference is the advantage", body: "Different nationalities, languages and career backgrounds make our teams sharper. We recruit for diverse perspectives and build engagement teams around them." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Life at Infinium" title="How it feels day to day" />
        <NumberedCards columns={4} items={[
          { title: "Small teams, real responsibility.", body: "No bench, no shadowing rotations, everyone contributes to client outcomes from their first week." },
          { title: "Engineering culture.", body: "R&D time is protected. Ideas from any level become products, QBricks and VBricks both started as internal builds." },
          { title: "Travel with purpose.", body: "Cross-hub working and client sites across the EU, Nordics and GCC, international exposure early in your career." },
          { title: "Giving back is structural.", body: "One4One internships and our university partnerships are part of how the firm runs, not a side programme." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="In pictures" title="Moments from the year" body="Two hubs, one team — how it looks when we're together." />
        <Reveal className="grid grid-cols-2 gap-px md:grid-cols-3">
          {([
            ["culture-cruise", "Summer party on the Amsterdam canals"],
            ["culture-gala", "The end-of-year gala"],
            ["culture-ski", "Ski night"],
            ["culture-win", "Winning together"],
            ["culture-canal", "Canalside in Amsterdam"],
            ["culture-summer", "The team in the sunshine"],
          ] as const).map(([slot, caption]) => (
            <figure key={slot} className="overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
              <GlassImage
                image={siteImage(slot)}
                alt={caption}
                sizes="(min-width: 768px) 30vw, 50vw"
                imageClassName="aspect-[4/3] object-cover"
              />
            </figure>
          ))}
        </Reveal>
      </ContentSection>
      <CTASection title="Sound like your kind of firm?" body="See open roles or start a conversation with the team." href="/careers" label="Your career" />
    </>
  );
}

export function SocialResponsibilityPage() {
  return (
    <>
      <HeroSection
        eyebrow="Social responsibility"
        title="One4One"
        body="Established in 2020 with our partner NextWave Consulting in London, One4One is our social enterprise internship programme. The principle is simple: for every new client engagement we win, we create a paid internship for a young adult taking their first step into a professional career, so our growth directly creates opportunity for the next generation."
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionIntro eyebrow="The programme" title="Opportunities for the next generation" />
            <Reveal className="space-y-5 leading-relaxed text-ice">
              <p>Some of the most powerful initiatives we have been involved in are those that create opportunities for the next generation. One4One helps young adults take their first step in a professional career through a unique, immersive internship experience, with each year&rsquo;s positions created in tandem with each new client engagement.</p>
              <p>Interns learn about the financial services industry, its biggest challenges and opportunities, and how these can be addressed with technology, learning directly from key players in the industry, including our clients and alliance partners, who generously share their knowledge throughout the programme.</p>
            </Reveal>
          </div>
          <Reveal>
            <figure className="overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
              <GlassImage
                image={siteImage("one4one-cohort")}
                alt="The team and new joiners gathered at our Amsterdam hub"
                sizes="(min-width: 768px) 45vw, 100vw"
                imageClassName="aspect-[6/5] object-cover"
              />
            </figure>
          </Reveal>
        </div>
      </ContentSection>
      <ContentSection>
        <NumberedCards items={[
          { title: "One engagement, one internship", body: "Every new client engagement funds a paid internship position, so our growth directly creates opportunity." },
          { title: "Immersive, real work", body: "Interns work inside live engagements and our R&D teams, not on the sidelines, building skills in data, AI and financial services." },
          { title: "Learning from the industry", body: "Clients and alliance partners share their knowledge and insights with each cohort throughout the programme." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Academic partnerships" title="Investing in the next generation of talent" />
        <StatGrid stats={[
          { value: "50+", label: "Students mentored & guided" },
          { value: "6", label: "Years, since 2020" },
        ]} />
        <Reveal className="mt-10">
          <figure className="overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
            <GlassImage
              image={siteImage("culture-offsite")}
              alt="One4One interns and mentors together outdoors"
              sizes="(min-width: 1280px) 1216px, 100vw"
              imageClassName="aspect-[21/9] object-cover"
            />
          </figure>
        </Reveal>
        <p className="mt-10 max-w-3xl leading-relaxed text-ice">We hold long-standing partnerships with the University of Groningen and Rotterdam School of Management, Erasmus University. Since 2020 we have mentored and guided more than 50 students through internships, thesis supervision and hands-on project work, bringing academic rigour into our engagements and real financial services experience into their careers.</p>
        {/* CardGrid carries no top margin of its own */}
        <div className="mt-10">
          <CardGrid columns={2} items={[
            { title: "University of Groningen", body: "Long-standing partnership, student mentoring, internships and thesis supervision." },
            { title: "Rotterdam School of Management, Erasmus University", body: "Long-standing partnership, guiding students from business school into financial services careers." },
          ]} />
        </div>
      </ContentSection>
      <CTASection title="Interested in joining One4One?" body="Tell us about yourself, we review applications for every new cohort." label="Get in touch" />
    </>
  );
}

export function IndustryEventsPage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Industry events" body="Where you'll find us. We speak, sponsor and share our thinking at the industry's leading events across the EU, Nordics and GCC, come and meet the team." />
      <ContentSection>
        {/* h1 → h3 skipped a level without this */}
        <SectionIntro eyebrow="Where we show up" title="Speaking, sponsoring and sharing our thinking" />
        <CardGrid columns={3} items={[
          { eyebrow: "Speaking", title: "TEDx", body: "Sharing our perspective on engineering, AI and the future of financial services with audiences beyond the industry." },
          { eyebrow: "Copenhagen", title: "Nordic Fintech Week", body: "Meeting the Nordic fintech community, where we serve banks, insurers and fintechs across the region." },
          { eyebrow: "Amsterdam", title: "Money20/20", body: "The world's biggest fintech gathering, on our home ground. Find us on the floor, or book time with the team in advance." },
        ]} />

        {/* out in the industry — a staggered set rather than another even grid */}
        <Reveal className="mt-px grid gap-px md:grid-cols-3">
          <figure className="overflow-hidden border hairline bg-abyss/25 md:col-span-2">
            <GlassImage
              image={siteImage("event-panel")}
              alt="An Infinium partner speaking on an industry panel"
              sizes="(min-width: 768px) 60vw, 100vw"
              imageClassName="aspect-[16/10] object-cover"
            />
          </figure>
          <figure className="overflow-hidden border hairline bg-abyss/25">
            <GlassImage
              image={siteImage("event-nordic")}
              alt="The team at Nordic Fintech Week"
              sizes="(min-width: 768px) 30vw, 100vw"
              imageClassName="aspect-[4/5] object-cover md:aspect-auto md:h-full"
            />
          </figure>
          <figure className="overflow-hidden border hairline bg-abyss/25">
            <GlassImage
              image={siteImage("event-alteryx")}
              alt="Presenting on the main stage at Alteryx Inspire"
              sizes="(min-width: 768px) 30vw, 100vw"
              imageClassName="aspect-[4/3] object-cover"
            />
          </figure>
          <figure className="overflow-hidden border hairline bg-abyss/25 md:col-span-2">
            <GlassImage
              image={siteImage("event-roundtable")}
              alt="An Infinium client roundtable in session"
              sizes="(min-width: 768px) 60vw, 100vw"
              imageClassName="aspect-[16/10] object-cover"
            />
          </figure>
        </Reveal>
        <Reveal className="mt-px">
          <figure className="overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)] md:grid md:grid-cols-[1fr_auto]">
            <GlassImage
              image={siteImage("events-nextwave")}
              alt="The team at an industry evening with our partner NextWave"
              sizes="(min-width: 1280px) 1216px, 100vw"
              imageClassName="aspect-[3/2] object-cover md:col-span-2"
            />
          </figure>
        </Reveal>
      </ContentSection>
      <CTASection title="Meet us at an event" body="Book time with our practice leads ahead of any event we attend." />
    </>
  );
}

export function ConsultingPartnersPage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Our business consulting partners" body="Alongside our technology partnerships, we work with established business consultancies who share our conviction: real industry experience at the heart of consulting." />
      <ContentSection>
        <div className="space-y-px">
          {[
            {
              eyebrow: "Partner · GCC",
              title: "Aspiro Management Consultants",
              facts: ["Region — Middle East (GCC), based in Dubai", "Focus — Business transformation for financial services"],
              site: { label: "aspiro.me", href: "https://aspiro.me" },
              // wide wordmarks, so heights are matched by optical area
              logo: { src: "/partners/aspiro.png", w: 463, h: 119, height: 34, alt: "Aspiro Management Consultants" },
              slot: "partners-aspiro" as const,
              imageAlt: "Infinium and Aspiro leadership together in Dubai",
              ps: [
                "Aspiro are business transformation management consultants who help ambitious financial services companies transform, grow and thrive in the regional and global marketplace.",
                "Based in the GCC with global reach to source talent, Aspiro puts real industry experience at the heart of consultancy, its team includes former bank COOs, CEOs and heads of operations from major regional and international institutions. Their extensive network of associates and partners allows engagements to scale up and down rapidly.",
                "Together, Infinium and Aspiro pair engineering-led delivery, QBricks, VBricks and our assessment tooling, with deep, on-the-ground business transformation expertise across the GCC's banks and financial institutions.",
              ],
              cta: "Talk to us about working in the GCC →",
            },
            {
              eyebrow: "Partner · UK",
              title: "NextWave Consulting",
              facts: ["Region — United Kingdom, 100 Bishopsgate, City of London", "Focus — Digital acceleration for financial services"],
              site: { label: "nxwave.com", href: "https://nxwave.com" },
              logo: { src: "/partners/nextwave.png", w: 720, h: 168, height: 33, alt: "NextWave Consulting" },
              slot: null,
              imageAlt: "",
              ps: [
                "NextWave is an award-winning digital acceleration consultancy based in the heart of the City, London's financial hub, a specialist alternative to the big-brand consultancies.",
                "Established in 2019, NextWave's leadership team has a 30-year track record supporting Global Tier 1 clients with complex change delivery, from specialised advisory to enterprise-scale programmes. The team is composed of senior C-level executives focused on large-scale transformation, data and digitally focused initiatives, everything done agile, at pace, and supported by best-in-class technology partners.",
                "Infinium and NextWave work in long-standing partnership, helping global clients with digital transformation initiatives and large-scale transformation across the UK and Europe.",
              ],
              cta: "Talk to us about working in the UK →",
            },
          ].map((p) => (
            <article key={p.title} className="grid gap-8 border hairline bg-abyss/25 p-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="eyebrow text-signal">{p.eyebrow}</p>
                <Image
                  src={p.logo.src}
                  alt={p.logo.alt}
                  width={p.logo.w}
                  height={p.logo.h}
                  style={{ height: `${p.logo.height}px` }}
                  className="mt-5 w-auto max-w-[70%] object-contain"
                />
                <h2 className="mt-5 text-(length:--text-step-2)">{p.title}</h2>
                <ul className="mt-6 space-y-2 text-(length:--text-body-sm) text-steel">
                  {p.facts.map((f) => <li key={f}>{f}</li>)}
                  <li>
                    Website —{" "}
                    <a
                      href={p.site.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-wipe text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:text-navy"
                    >
                      {p.site.label} ↗
                    </a>
                  </li>
                </ul>
                {p.slot ? (
                  <figure className="mt-7 overflow-hidden border hairline">
                    <GlassImage
                      image={siteImage(p.slot)}
                      alt={p.imageAlt}
                      sizes="(min-width: 768px) 30vw, 100vw"
                      imageClassName="aspect-[4/3] object-cover"
                    />
                  </figure>
                ) : null}
              </div>
              <div className="space-y-5 leading-relaxed text-ice md:col-span-8">
                {p.ps.map((x) => <p key={x}>{x}</p>)}
                <SecondaryLink href="/contact">{p.cta}</SecondaryLink>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
      <CTASection title="Interested in partnering with Infinium?" body="We partner selectively, where industry depth meets engineering discipline." />
    </>
  );
}

export function CareersWirePage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Your career" body="We are a values-led firm built from seasoned professionals and dynamic new talent, working on the hardest problems in financial services, from Amsterdam and Dubai." />
      <ContentSection>
        <div className="mb-14 grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <SectionIntro eyebrow="Why Infinium" title="Work that would take a decade elsewhere" />
          </div>
          <div className="overflow-hidden border hairline md:col-span-5">
            <GlassImage image={siteImage("careers")} alt="The Infinium team looking down from the balcony of the Amsterdam office" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>
        <NumberedCards items={[
          { title: "Learn from practitioners", body: "Work directly with MD-level leaders who have run these programmes inside the world's largest financial institutions." },
          { title: "Real responsibility, early", body: "Small teams and client-facing delivery from day one, your work ships to leading banks and financial institutions, not a slide library." },
          { title: "Engineering with context", body: "Build disruptive products — QBricks in our Netherlands R&D team, VBricks in DIFC, Dubai — or deliver them with clients." },
        ]} />
      </ContentSection>
      <PhotoCollage shots={CULTURE_COLLAGE} label="The team at Infinium, in pictures" />
      <CTASection title="Ready to do the best work of your career?" body="Tell us about yourself and the work you want to do." label="Get in touch" />
    </>
  );
}

export function LocationPage({ city }: { city: "amsterdam" | "dubai" }) {
  const dubai = city === "dubai";
  const officeImages = dubai
    ? ([
        ["dxb-innovationone", "Innovation One, DIFC"],
        ["dxb-workspace", "The workspace"],
        ["dxb-ai-campus", "Dubai AI Campus"],
        ["dxb-innovation-hub", "The DIFC Innovation Hub"],
        ["dxb-innovation-wall", "Innovation One"],
        ["dxb-lobby", "The lobby"],
        ["dxb-entrance", "Innovation One entrance"],
        // last entry spans both columns — the landmark shot earns it
        ["dxb-difc-gate", "The Gate, Dubai International Financial Centre"],
      ] as const)
    : ([
        ["ams-office", "Inside our Amsterdam office"],
        ["ams-stairs", "The staircase"],
        ["dxb-lounge", "Our R&D team in Amsterdam"],
        ["ams-atrium", "The atrium"],
        ["ams-hall", "Fred Roeskestraat 115"],
      ] as const);
  const [, ...officeGallery] = officeImages;

  return (
    <>
      <HeroSection
        eyebrow="Locations"
        title={dubai ? "DIFC, Dubai" : "Amsterdam, The Netherlands"}
        body={dubai ? "Our Middle East hub in the Dubai International Financial Centre, home of our second R&D team, serving the GCC markets." : "Our headquarters, home of Infinium Consulting B.V. and one of our two R&D teams, serving the EU and Nordic markets."}
      />
      <ContentSection>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIntro eyebrow="From this office" title={dubai ? "Middle East (GCC) markets" : "EU & Nordic markets"} />
            <p className="leading-relaxed text-ice">
              {dubai
                ? "From the DIFC we serve banks, financial markets firms and fintechs across the GCC. Supported by the UAE government to design, develop and deliver AI-focused solutions, our teams are based in the state-of-the-art Innovation One innovation centre in DIFC, Dubai. The office houses our second R&D team, where VBricks — our model testing and validation solution — is designed and developed."
                : "From Amsterdam we serve banks, financial markets firms, insurers and fintechs across the EU and the Nordics. The office also houses our Netherlands R&D team, where QBricks — our governed, AI-ready data products solution — is designed and developed."}
            </p>
            <p className="mt-8"><SecondaryLink href="/solutions">Explore our solutions →</SecondaryLink></p>
            <div className="mt-12 w-full max-w-4xl">
              {dubai ? <DubaiOfficeVideo /> : <NetherlandsOfficeVideo />}
              <div className="mt-4 grid items-start gap-4 sm:grid-cols-2">
                {officeGallery.map(([slot, caption], index) => {
                  const isFinalImage = index === officeGallery.length - 1;
                  return (
                    <figure key={slot} className={`self-start overflow-hidden border hairline ${isFinalImage ? "sm:col-span-2" : ""}`}>
                      <GlassImage
                        image={siteImage(slot)}
                        alt={caption}
                        sizes={isFinalImage ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 640px) 30vw, 100vw"}
                        imageClassName={isFinalImage ? "aspect-video object-cover" : "aspect-[4/3] object-cover"}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
          <aside className="self-start border hairline bg-abyss/25 p-7 lg:col-span-5">
            <p className="eyebrow text-signal">{dubai ? "Office details" : "Head office"}</p>
            <dl className="mt-6 space-y-6">
              {(dubai ? [
                ["Entity", "Infinium Technology Ltd"],
                ["Location", "Dubai International Financial Centre"],
                ["Address", "Innovation One, DIFC, Dubai"],
                ["Email", "sales@infinium.technology"],
              ] : [
                ["Entity", "Infinium Consulting B.V."],
                ["Address", "Fred Roeskestraat 115, Amsterdam, The Netherlands"],
                ["Email", "sales@infinium.technology"],
              ]).map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-ice">
                    {k === "Email" ? (
                      <a className="underline decoration-navy/20 underline-offset-4 transition-colors hover:text-signal" href="mailto:sales@infinium.technology">
                        sales@infinium.technology
                      </a>
                    ) : v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8"><PrimaryLink href="/contact">Speak to an expert</PrimaryLink></p>
          </aside>
        </div>
      </ContentSection>
    </>
  );
}

/* ---- Contact ----------------------------------------------------------- */

export function ContactWireIntro({ form }: { form: React.ReactNode }) {
  return (
    <>
      {/* one composition, not hero-then-page: the old layout spent 400px
          restating what the form heading already says */}
      <section className="relative overflow-hidden pb-20 pt-40 md:pb-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(35,79,189,0.08),transparent_32rem)]" />
        <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <Reveal>
            <p className="eyebrow text-signal">Contact</p>
            <h1 className="mt-6 max-w-4xl text-(length:--text-step-5) leading-[1.02]">Speak to an expert</h1>
            <p className="mt-7 max-w-3xl text-(length:--text-step-1) leading-normal text-ice">
              We provide a free goals review with one of our industry leaders to understand your ambitions and explore the options to accelerate your business.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-5">
              {/* the enquiry goes to people, and here they are */}
              <div className="flex items-center gap-4 border hairline bg-white/82 p-5 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
                <div aria-hidden className="flex shrink-0 -space-x-2.5">
                  {["david-aston-v2", "toby-smith-cullen", "erik-rowbotham", "helen-bull"].map((slug) => (
                    <Image
                      key={slug}
                      src={`/img/team/${slug}.webp`}
                      alt=""
                      width={600}
                      height={600}
                      sizes="44px"
                      className="size-11 rounded-full border-2 border-white object-cover grayscale"
                    />
                  ))}
                </div>
                <p className="text-(length:--text-body-sm) leading-snug text-glass">
                  Your message goes straight to our practice leads — there is no sales layer.
                </p>
              </div>

              <div className="mt-10">
                <p className="eyebrow text-signal">What happens next</p>
                <ol className="mt-6 space-y-0">
                  {([
                    ["01", "Schedule a discussion", "With one of our industry practice leads to review your goals and challenges."],
                    ["02", "Get a customised approach", "We shape strategy and solution options around your business."],
                    ["03", "Deliver together", "We work with you to deliver your strategic initiatives."],
                  ] as const).map(([num, title, body], i) => (
                    <li key={num} className={`flex gap-5 py-5 ${i > 0 ? "border-t hairline" : ""}`}>
                      <span className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{num}</span>
                      <span>
                        <span className="block text-(length:--text-body) font-medium text-paper">{title}</span>
                        <span className="mt-1.5 block text-(length:--text-body-sm) leading-relaxed text-ice">{body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 border-t hairline pt-8">
                <p className="eyebrow text-signal">Prefer email?</p>
                <p className="mt-4">
                  <a
                    href="mailto:sales@infinium.technology"
                    className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-cobalt transition-colors duration-(--duration-fast) hover:text-navy"
                  >
                    sales@infinium.technology →
                  </a>
                </p>
                <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">
                  Serving the EU, Nordic and Middle East (GCC) markets from Amsterdam and Dubai.
                </p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-7">
              {/* the form earns a surface of its own */}
              <div className="border hairline bg-surface/82 p-6 shadow-[0_14px_40px_rgba(23,56,102,0.06)] sm:p-9">
                <h2 className="text-(length:--text-step-2)">Tell us about your goals</h2>
                <div className="mt-8">{form}</div>
              </div>
            </Reveal>
          </div>
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ice/12" />
      </section>

      {/* the offices, done properly — we have the photography */}
      <ContentSection>
        <SectionIntro eyebrow="Or visit us" title="Where you'll find us" />
        <Reveal className="grid gap-px md:grid-cols-2">
          {([
            ["ams-exterior", "Amsterdam, The Netherlands", "Infinium Consulting B.V. — Fred Roeskestraat 115, Amsterdam", "/about/amsterdam", "Our building at Fred Roeskestraat 115, Amsterdam"],
            ["dxb-innovationone", "DIFC, Dubai", "Infinium Technology Ltd — Innovation One, Dubai International Financial Centre", "/about/dubai", "Innovation One in the Dubai International Financial Centre"],
          ] as const).map(([slot, title, body, href, alt]) => (
            <Link
              key={slot}
              href={href}
              className="spot group relative block h-full overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void transition-[border-color,transform,background,box-shadow] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/45 hover:bg-white hover:shadow-[0_14px_34px_rgba(23,56,102,0.075)] focus-visible:border-signal/60 focus-visible:bg-white"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 z-10 h-px origin-left scale-x-0 bg-signal transition-transform duration-(--duration-base) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              <div className="overflow-hidden">
                <GlassImage
                  image={siteImage(slot)}
                  alt={alt}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  imageClassName="aspect-[16/9] object-cover transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                />
              </div>
              <div className="border-t hairline p-7">
                <h3 className="text-(length:--text-step-1) leading-tight">{title}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
                <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Visit this office →</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </ContentSection>
    </>
  );
}

/* ---- Route table ------------------------------------------------------- */

export function routeFor(slug: string[]): Route {
  const path = `/${slug.join("/")}`;
  const routes: Record<string, Route> = {
    "/": { render: () => <HomeWirePage />, meta: { title: "Months, not years", description: "Engineering excellence combined with deep industry expertise. Turning data into decisions." } },
    "/services": { render: () => <ServicesWirePage />, meta: { title: "Our services", description: "Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services." } },
    "/solutions": { render: () => <SolutionsWirePage />, meta: { title: "Our solutions", description: "Pre-built solutions and assessment tooling that shorten delivery timelines and de-risk your programmes." } },
    "/solutions/qbricks": { render: () => <QBricksPage />, meta: { title: "QBricks", description: "Turn systems of record into governed, A.I.-ready data products in hours, not years." } },
    "/solutions/vbricks": { render: () => <VBricksPage />, meta: { title: "VBricks", description: "Engineered model testing with automated test packs, challenger comparisons and complete evidence trails." } },
    "/solutions/ai-factory": { render: () => <AIFactoryPage />, meta: { title: "AI Factory", description: "From AI pilots to an industrial AI capability — one governed data engine, platform, delivery pods and operating model, engineered for regulated finance." } },
    "/solutions/esg-reporting": { render: () => <ESGReportingPage />, meta: { title: "ESG reporting platform", description: "Audit-ready ESG disclosure on one governed platform — three hubs for sourcing, processing and reporting, aligned to CSRD, CSDDD, GRI and ISSB." } },
    "/solutions/ai-assessment": { render: () => <AssessmentPage kind="ai" />, meta: { title: "AI assessment", description: "A measured, practitioner-built view of your AI readiness." } },
    "/solutions/quantexa-maturity-assessment": { render: () => <AssessmentPage kind="quantexa" />, meta: { title: "Quantexa maturity assessment", description: "Benchmark your Quantexa maturity with Infinium's 750+ question assessment across platform & solution design, delivery, testing and resource capability." } },
    "/sectors": { render: () => <SectorsWirePage />, meta: { title: "Sectors", description: "Deep, current experience across the regulated financial landscape." } },
    "/technologies": { render: () => <TechnologiesWirePage />, meta: { title: "Technologies", description: "Best-in-class fintech and platform technology partners." } },
    "/technologies/alteryx-bootcamps": { render: () => <AlteryxBootcampsPage />, meta: { title: "Alteryx Bootcamps", description: "Intensive, hands-on Alteryx training." } },
    "/insights": { render: () => <InsightsWirePage />, meta: { title: "Case studies", description: "How we have helped our clients." } },
    "/perspectives": { render: () => <PerspectivesPage />, meta: { title: "News & perspectives", description: "Perspectives from our practice leads and R&D teams across regulated finance." } },
    "/about": { render: () => <AboutWirePage />, meta: { title: "About us", description: "It's all about business outcomes." } },
    "/about/infinium-labs": { render: () => <InfiniumLabsPage />, meta: { title: "Infinium Labs", description: "Our engineering and product team in Amsterdam and DIFC, Dubai — practitioners from ABN AMRO, ING, APG and MSCI building QBricks and VBricks." } },
    "/about/culture": { render: () => <CulturePage />, meta: { title: "Our culture", description: "An international firm by design." } },
    "/about/social-responsibility": { render: () => <SocialResponsibilityPage />, meta: { title: "Social responsibility", description: "One4One social enterprise internship programme." } },
    "/about/industry-events": { render: () => <IndustryEventsPage />, meta: { title: "Industry events", description: "Where you'll find us." } },
    "/about/consulting-partners": { render: () => <ConsultingPartnersPage />, meta: { title: "Business consulting partners", description: "Established business consultancies who share our conviction." } },
    "/about/amsterdam": { render: () => <LocationPage city="amsterdam" />, meta: { title: "Amsterdam, The Netherlands", description: "Our headquarters, home of Infinium Consulting B.V." } },
    "/about/dubai": { render: () => <LocationPage city="dubai" />, meta: { title: "DIFC, Dubai", description: "Our Middle East hub in the Dubai International Financial Centre." } },
    "/careers": { render: () => <CareersWirePage />, meta: { title: "Your career", description: "We are a values-led firm built from seasoned professionals and dynamic new talent." } },
  };

  for (const s of SERVICES) routes[`/services/${s.slug}`] = {
    render: () => <ServiceDetailPage slug={s.slug} />,
    meta: { title: s.title, description: s.lead },
  };
  for (const t of Object.keys(TECHNOLOGY_DETAIL)) routes[`/technologies/${t}`] = {
    render: () => <TechnologyDetailPage slug={t} />,
    meta: { title: TECHNOLOGY_DETAIL[t].title, description: TECHNOLOGY_DETAIL[t].body },
  };
  for (const c of CASE_STUDIES) routes[`/insights/${c.slug}`] = {
    render: () => <CaseStudyWirePage slug={c.slug} />,
    meta: { title: c.title, description: c.summary },
  };

  const route = routes[path];
  if (!route) notFound();
  return route;
}

export const ALL_PATHS = [
  "",
  "services",
  ...SERVICES.map((s) => `services/${s.slug}`),
  "solutions",
  "solutions/qbricks",
  "solutions/vbricks",
  "solutions/ai-factory",
  "solutions/esg-reporting",
  "solutions/ai-assessment",
  "solutions/quantexa-maturity-assessment",
  "sectors",
  "technologies",
  ...Object.keys(TECHNOLOGY_DETAIL).map((t) => `technologies/${t}`),
  "technologies/alteryx-bootcamps",
  "insights",
  ...CASE_STUDIES.map((c) => `insights/${c.slug}`),
  "perspectives",
  "about",
  "about/infinium-labs",
  "about/culture",
  "about/social-responsibility",
  "about/industry-events",
  "about/consulting-partners",
  "about/amsterdam",
  "about/dubai",
  "careers",
  "contact",
  "privacy",
  "terms",
  "cookies",
  "accessibility",
];
