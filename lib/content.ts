import type { SiteImage } from "@/lib/images";
import { siteImage } from "@/lib/images";

/*
 * Central information architecture and copy, extracted verbatim from the
 * Infinium wireframes (Infinium design system wireframe_11072026). Layout
 * and styling are supplied entirely by the existing design system; this
 * module carries only structure + words so nav, footer, service, sector,
 * technology and case-study surfaces stay in sync.
 */

export type NavItem = { label: string; href: string };
export type NavGroup = { label: string; href: string; items: NavItem[] };

/* ---- Services ---------------------------------------------------------- */

export type Service = {
  slug: string;
  eyebrow: string; // "Our services · <category>"
  category: string;
  title: string;
  lead: string;
  navBody: string; // short body used on the Services index cards
};

export const SERVICES: Service[] = [
  {
    slug: "data-and-ai",
    eyebrow: "Intelligence",
    category: "Intelligence",
    title: "Data & AI",
    lead: "Sourcing, governing and leveraging enterprise data, and taking AI from pilots to production, responsibly.",
    navBody:
      "Sourcing, governing and leveraging enterprise data, and taking AI from pilots to production, responsibly.",
  },
  {
    slug: "digital-and-automation",
    eyebrow: "Automation",
    category: "Automation",
    title: "Digital & automation",
    lead: "AI-enabled process automation that takes key processes from weeks to minutes.",
    navBody:
      "AI-enabled process automation that takes key processes from weeks to minutes.",
  },
  {
    slug: "regulation-and-compliance",
    eyebrow: "Risk & control",
    category: "Risk & control",
    title: "Regulation & compliance",
    lead: "Meeting new regulation, managing risk and enhancing controls across the enterprise.",
    navBody:
      "Meeting new regulation, managing risk and enhancing controls across the enterprise.",
  },
  {
    slug: "strategy-and-change",
    eyebrow: "Advisory",
    category: "Advisory",
    title: "Strategy and Change",
    lead: "Business, technology and data strategy shaped up front to pave the way for successful execution.",
    navBody:
      "Business, technology and data strategy shaped up front to pave the way for successful execution.",
  },
  {
    slug: "sustainable-finance",
    eyebrow: "Risk & control",
    category: "Risk & control",
    title: "Sustainable finance",
    lead: "ESG reporting and climate-aligned finance solutions, delivered at programme pace.",
    navBody:
      "ESG reporting and climate-aligned finance solutions, delivered at programme pace.",
  },
  {
    slug: "transformation",
    eyebrow: "Delivery",
    category: "Delivery",
    title: "Transformation",
    lead: "Programme leadership for complex change, from operating models to entity stand-ups.",
    navBody:
      "Programme leadership for complex change, from operating models to entity stand-ups.",
  },
];

/* ---- Sectors ----------------------------------------------------------- */

export type Sector = { num: string; title: string; body: string };

export const SECTORS: Sector[] = [
  {
    num: "01",
    title: "Asset & wealth management",
    body: "Distribution, order management, reporting and cost transparency across mandates.",
  },
  {
    num: "02",
    title: "Banks",
    body: "Lending, payments and regulatory reporting modernisation under supervisory pressure.",
  },
  {
    num: "03",
    title: "Financial markets",
    body: "Capital markets transformation, regulatory change and entity restructuring.",
  },
  {
    num: "04",
    title: "Fintechs",
    body: "Scale-up operating models, case management and customer lifecycle processes.",
  },
  {
    num: "05",
    title: "Growth companies",
    body: "Data, technology and operating model strategy for fast-growing firms.",
  },
  {
    num: "06",
    title: "Insurers",
    body: "Finance re-engineering, claims transformation and technology strategy.",
  },
];

/* ---- Technologies ------------------------------------------------------ */

export type Technology = { slug: string; name: string; tagline: string };

export const TECHNOLOGIES: Technology[] = [
  { slug: "alteryx", name: "Alteryx", tagline: "Analytics automation, replacing spreadsheet-bound processes with governed workflows." },
  { slug: "appian", name: "Appian", tagline: "Low-code process automation for case management and customer lifecycle." },
  { slug: "databricks", name: "Databricks", tagline: "Lakehouse platform for enterprise data engineering and AI." },
  { slug: "microsoft-fabric", name: "Microsoft", tagline: "Cloud data and analytics foundation for regulated workloads." },
  { slug: "quantexa", name: "Quantexa", tagline: "Decision intelligence, contextual monitoring for CDD, correspondent banking and fraud." },
];

/* ---- Case studies ------------------------------------------------------ */

export type CaseStudy = {
  slug: string;
  service: string;
  sector: string;
  location: string;
  title: string;
  summary: string;
  stats: { value: string; label: string }[];
  challenge: string[];
  approach: string[];
  outcome: string[];
  related: string[]; // slugs
  image: () => SiteImage;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "regulatory-reporting",
    service: "Digital & Automation",
    sector: "Banks",
    location: "Amsterdam",
    title: "Automated regulatory reporting for an international banking corporation",
    summary:
      "How a four-week regulatory reporting cycle was reduced to five minutes with a single, auditable source of trading data.",
    stats: [
      { value: "4 wks → 5 min", label: "End-to-end reporting cycle" },
      { value: "1", label: "Single source of trading data" },
      { value: "100%", label: "Auditable, documented process" },
    ],
    challenge: [
      "Key regulatory reports were assembled manually from extracts across multiple trading systems, taking up to four weeks per cycle.",
      "Logic lived in spreadsheets maintained by a small number of individuals, creating key-person risk and limited auditability.",
      "Regulators expected faster, more transparent submissions, and volumes were growing.",
    ],
    approach: [
      "Mapped the end-to-end reporting process and data lineage with the reporting team, identifying every manual touchpoint.",
      "Rebuilt the pipeline in Alteryx: automated ingestion, reconciliation and validation of trading data from source systems.",
      "Established a single governed dataset of trading data, reused across adjacent regulatory and management reports.",
      "Embedded exception-based controls, a full audit trail and documentation, then trained the team to own the workflows.",
    ],
    outcome: [
      "Reporting cycle reduced from four weeks to five minutes, with exceptions surfaced automatically for review.",
      "A single source of trading data now feeds further regulatory and management reporting.",
      "Every step is documented and auditable, removing key-person dependency.",
    ],
    related: ["big-data-engineering", "capital-requirements", "climate-reporting"],
    image: () => siteImage("cs-reg-reporting"),
  },
  {
    slug: "entity-stand-up",
    service: "Transformation",
    sector: "Financial Markets",
    location: "Amsterdam",
    title: "Entity stand-up of a major UK bank\u2019s financial markets business in the Netherlands",
    summary:
      "Standing up a licensed Dutch entity — governance, operating model and client migration — to keep serving EU clients without disruption.",
    stats: [
      { value: "12 mos", label: "From mandate to licensed, operational entity" },
      { value: "40+", label: "Workstreams coordinated across the programme" },
      { value: "0", label: "Client disruption at cutover" },
    ],
    challenge: [
      "The bank needed a fully licensed EU entity to continue serving European financial markets clients.",
      "Licensing, capital, governance, technology and client migration had to progress in parallel against a fixed regulatory deadline.",
      "The receiving organisation had limited local infrastructure and needed a target operating model built from the ground up.",
    ],
    approach: [
      "Designed and ran the programme governance, integrating legal, risk, operations and front-office workstreams.",
      "Supported the licence application and ongoing dialogue with the Dutch and European regulators.",
      "Defined the target operating model — booking model, controls, staffing and outsourcing arrangements.",
      "Planned and executed client migration in waves, with repapering, testing and fallback plans per wave.",
    ],
    outcome: [
      "The entity was licensed and operational on schedule, with day-one readiness across all functions.",
      "Clients were migrated in controlled waves with no interruption to trading.",
      "The programme handed over to business-as-usual teams with a documented operating model.",
    ],
    related: ["data-strategy", "capital-requirements", "regulatory-reporting"],
    image: () => siteImage("cs-entity-standup"),
  },
  {
    slug: "data-strategy",
    service: "Strategy and Change",
    sector: "Insurers",
    location: "Amsterdam",
    title: "Data and technology strategy for a leading insurance and technology group",
    summary:
      "A five-year data and technology strategy, documented at detail level in eight weeks and aligned to the group\u2019s growth ambitions.",
    stats: [
      { value: "8 wks", label: "To a documented, board-approved strategy" },
      { value: "5 yrs", label: "Roadmap of sequenced, costed initiatives" },
      { value: "12", label: "Business areas engaged and aligned" },
    ],
    challenge: [
      "The group had grown rapidly through acquisition, leaving a fragmented data and technology landscape.",
      "Leadership lacked a shared view of current-state capabilities and where to invest next.",
      "Previous strategy efforts had stalled at slideware without an actionable roadmap.",
    ],
    approach: [
      "Ran structured discovery across twelve business areas: interviews, system inventories and capability assessments.",
      "Benchmarked current-state maturity against peers and the group\u2019s ambitions.",
      "Co-designed the target architecture and operating model with group and divisional CTOs.",
      "Sequenced a five-year roadmap with costed initiatives, dependencies and quick wins.",
    ],
    outcome: [
      "A board-approved data and technology strategy documented at detail level within eight weeks.",
      "A costed five-year roadmap, with the first quick wins mobilised immediately.",
      "Shared language and ownership across group and divisional leadership.",
    ],
    related: ["big-data-engineering", "fintech-transformation", "entity-stand-up"],
    image: () => siteImage("cs-data-strategy"),
  },
  {
    slug: "big-data-engineering",
    service: "Data & AI",
    sector: "Banks",
    location: "Amsterdam",
    title: "Big data engineering for a global universal bank",
    summary:
      "Hands-on engineering leadership to standardise big data architecture, cut vendor lock-in and accelerate solution development.",
    stats: [
      { value: "$5m", label: "Vendor savings realised" },
      { value: "20–30%", label: "Engineering efficiency gains" },
      { value: "1", label: "Design authority governing all patterns" },
    ],
    challenge: [
      "Projects had not followed standard data architecture patterns or software engineering principles, creating cost and fragility.",
      "Manual data processes were becoming increasingly expensive as the business grew.",
      "Heavy reliance on vendor platforms tied roadmaps to vendor priorities rather than business value.",
    ],
    approach: [
      "Established a design authority to define and govern architecture patterns, migrating disparate practices to the standard.",
      "Built open-source replacements for vendor solutions where they offered better value.",
      "Accelerated adoption of containerisation technologies to decouple services from one another.",
      "Led an initiative to open-source selected bank projects, engaging with the open-source community.",
    ],
    outcome: [
      "Vendor savings of $5m and engineering efficiency gains of 20–30%.",
      "Fewer production issues and lower production support costs.",
      "Faster solution development and readiness for cloud migration.",
    ],
    related: ["tbml-detection", "data-strategy", "regulatory-reporting"],
    image: () => siteImage("cs-big-data"),
  },
  {
    slug: "finance-re-engineering",
    service: "Digital & Automation",
    sector: "Insurers",
    location: "Amsterdam",
    title: "Insurance finance re-engineering: retiring Excel-reliant processes",
    summary:
      "Re-engineering finance processes reliant on end-user computing, removing operational risk and freeing the team for analysis.",
    stats: [
      { value: "18 hrs → 5 min", label: "Core process runtime after automation" },
      { value: "60+", label: "Excel-based processes assessed and prioritised" },
      { value: "12 hrs", label: "Saved per month on operational reporting" },
    ],
    challenge: [
      "Core finance processes depended on long chains of undocumented spreadsheets.",
      "Month-end close was slow and error-prone, with material operational risk flagged by internal audit.",
      "The team spent its time producing numbers rather than analysing them.",
    ],
    approach: [
      "Inventoried and risk-ranked the estate of end-user computing across the finance function.",
      "Re-engineered the highest-risk processes in Alteryx with automated reconciliation and controls.",
      "Established standards, peer review and a support model for the remaining estate.",
      "Upskilled finance staff to build and maintain their own workflows.",
    ],
    outcome: [
      "A core process reduced from 18 hours to 5 minutes.",
      "Operational reporting moved from monthly to weekly, saving around 12 hours a month.",
      "Audit findings closed, with a documented and controlled process estate.",
    ],
    related: ["regulatory-reporting", "climate-reporting", "fintech-transformation"],
    image: () => siteImage("cs-finance-reeng"),
  },
  {
    slug: "fintech-transformation",
    service: "Digital & Automation",
    sector: "Fintechs",
    location: "Amsterdam",
    title: "Digital transformation for a fast-growing fintech",
    summary:
      "Digitising an alternatives investment process into an end-to-end deal platform in under three months.",
    stats: [
      { value: "8 wks", label: "To a working digital platform" },
      { value: "8–10×", label: "Faster solution development" },
      { value: "1", label: "End-to-end deal platform, front to back" },
    ],
    challenge: [
      "A manual, document-heavy investment process could not scale with the firm\u2019s growth.",
      "Deal data was scattered across email, spreadsheets and shared drives.",
      "The firm needed a platform quickly, without building a large technology function.",
    ],
    approach: [
      "Mapped the end-to-end deal lifecycle with the investment team.",
      "Built the platform on a low-code stack, iterating with users in weekly releases.",
      "Integrated document management, approvals and reporting into a single workflow.",
      "Handed over with training and a lightweight support model.",
    ],
    outcome: [
      "An end-to-end deal platform live in under three months.",
      "A single source of deal data, from origination to close.",
      "A platform the firm now demonstrates to its own clients.",
    ],
    related: ["finance-re-engineering", "data-strategy", "big-data-engineering"],
    image: () => siteImage("cs-fintech-dx"),
  },
  {
    slug: "tbml-detection",
    service: "Data & AI",
    sector: "Banks",
    location: "Dubai",
    title: "Trade-based money laundering detection with decision intelligence",
    summary:
      "Using entity resolution and network analytics to surface trade-based money laundering risk hidden across siloed data.",
    stats: [
      { value: "5", label: "Internal and external data sources unified" },
      { value: "40%", label: "Reduction in false-positive alerts" },
      { value: "1", label: "Contextual view of each trade network" },
    ],
    challenge: [
      "Trade finance monitoring relied on rules over single transactions, missing risk that only appears across networks.",
      "Customer, counterparty and trade data sat in silos with no common entity view.",
      "Investigators spent most of their time on false positives and manual data gathering.",
    ],
    approach: [
      "Deployed decision intelligence with entity resolution across five internal and external data sources.",
      "Built network analytics to score trade relationships and corridors, not just transactions.",
      "Designed risk typologies with the financial crime team, tuned against historical cases.",
      "Integrated contextual alerts into the existing case management workflow.",
    ],
    outcome: [
      "False-positive alerts reduced by around 40%, with richer context per alert.",
      "Investigators start from a resolved network view instead of assembling data manually.",
      "A platform foundation reused for adjacent financial crime use cases.",
    ],
    related: ["big-data-engineering", "capital-requirements", "regulatory-reporting"],
    image: () => siteImage("cs-data-strategy"),
  },
  {
    slug: "capital-requirements",
    service: "Regulation and Compliance",
    sector: "Banks",
    location: "Dubai",
    title: "Capital requirements regulatory reporting for an international bank",
    summary:
      "Automating capital requirements returns — from days of manual assembly to a controlled, repeatable process.",
    stats: [
      { value: "5 days → hrs", label: "Per reporting cycle" },
      { value: "0", label: "Late or resubmitted returns since go-live" },
      { value: "100%", label: "Data lineage documented to source" },
    ],
    challenge: [
      "Capital requirements returns were assembled manually from finance and risk extracts over several days.",
      "Late adjustments forced rework and created resubmission risk.",
      "The regulator had raised expectations on data quality and lineage.",
    ],
    approach: [
      "Documented the return production process and data lineage end to end.",
      "Automated sourcing, enrichment and validation of finance and risk data.",
      "Built reconciliation and variance checks that run before, not after, submission.",
      "Implemented a controlled adjustments process with a full audit trail.",
    ],
    outcome: [
      "Production time reduced from five days to hours per cycle.",
      "No late or resubmitted returns since go-live.",
      "Documented lineage to source, satisfying regulatory scrutiny.",
    ],
    related: ["regulatory-reporting", "tbml-detection", "entity-stand-up"],
    image: () => siteImage("cs-reg-reporting"),
  },
  {
    slug: "climate-reporting",
    service: "Sustainable Finance",
    sector: "Banks",
    location: "Amsterdam",
    title: "Automating bank-wide climate reporting disclosures",
    summary:
      "An enterprise-viable climate and ESG reporting solution, engineered to scale across the bank in just over eight weeks.",
    stats: [
      { value: "8 wks", label: "To an enterprise-viable solution" },
      { value: "12", label: "Business areas designed to scale across" },
      { value: "1", label: "Governed ESG data model" },
    ],
    challenge: [
      "Climate disclosure requirements were expanding faster than the bank\u2019s manual reporting could keep up with.",
      "ESG data was sourced ad hoc from vendors and business units with inconsistent definitions.",
      "The first regulatory deadline left no room for a multi-year build.",
    ],
    approach: [
      "Defined a governed ESG data model and sourcing strategy with finance and risk.",
      "Automated ingestion and quality checks of vendor and internal ESG data.",
      "Built disclosure outputs mapped to the applicable reporting frameworks.",
      "Engineered the solution to extend across twelve business areas without rework.",
    ],
    outcome: [
      "An enterprise-viable ESG reporting solution delivered in just over eight weeks.",
      "Consistent, governed ESG data with documented definitions and quality rules.",
      "A platform positioned to absorb successive disclosure requirements.",
    ],
    related: ["regulatory-reporting", "finance-re-engineering", "data-strategy"],
    image: () => siteImage("cs-fintech-dx"),
  },
];

export function caseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/* ---- Global chrome ----------------------------------------------------- */

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    items: [
      { label: "Our services", href: "/services" },
      { label: "Strategy and Change", href: "/services/strategy-and-change" },
      { label: "Transformation", href: "/services/transformation" },
      { label: "Digital and Automation", href: "/services/digital-and-automation" },
      { label: "Data and AI", href: "/services/data-and-ai" },
      { label: "Regulation and Compliance", href: "/services/regulation-and-compliance" },
      { label: "Sustainable Finance", href: "/services/sustainable-finance" },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    items: [
      { label: "Our solutions", href: "/solutions" },
      { label: "QBricks", href: "/solutions" },
      { label: "VBricks", href: "/solutions" },
      { label: "AI assessment", href: "/solutions/ai-assessment" },
      { label: "Quantexa maturity assessment", href: "/solutions/quantexa-maturity-assessment" },
    ],
  },
  {
    label: "Sectors",
    href: "/sectors",
    items: [
      { label: "Asset & wealth management", href: "/sectors" },
      { label: "Banks", href: "/sectors" },
      { label: "Financial markets", href: "/sectors" },
      { label: "Fintechs", href: "/sectors" },
      { label: "Growth companies", href: "/sectors" },
      { label: "Insurers", href: "/sectors" },
    ],
  },
  {
    label: "Technologies",
    href: "/technologies",
    items: [
      { label: "Our technologies", href: "/technologies" },
      { label: "Alteryx", href: "/technologies/alteryx" },
      { label: "Appian", href: "/technologies/appian" },
      { label: "Databricks", href: "/technologies/databricks" },
      { label: "Microsoft", href: "/technologies/microsoft-fabric" },
      { label: "Quantexa", href: "/technologies/quantexa" },
    ],
  },
  {
    label: "Insights",
    href: "/insights",
    items: [
      { label: "Case studies", href: "/insights" },
      { label: "News & perspectives", href: "/insights" },
    ],
  },
  {
    label: "About",
    href: "/about",
    items: [
      { label: "About us", href: "/about" },
      { label: "Our culture", href: "/about/culture" },
      { label: "Social responsibility", href: "/about/social-responsibility" },
      { label: "Industry events", href: "/about/industry-events" },
      { label: "Consulting Partners", href: "/about/consulting-partners" },
      { label: "Your career", href: "/careers" },
      { label: "Amsterdam", href: "/about/amsterdam" },
      { label: "Dubai", href: "/about/dubai" },
    ],
  },
];

export const FOOTER_COLUMNS: NavGroup[] = [
  {
    label: "what we do",
    href: "/services",
    items: [
      { label: "Our services", href: "/services" },
      { label: "Our solutions", href: "/solutions" },
      { label: "Technologies", href: "/technologies" },
      { label: "Case studies", href: "/insights" },
    ],
  },
  {
    label: "where we work",
    href: "/sectors",
    items: [
      { label: "Banks", href: "/sectors" },
      { label: "Financial markets", href: "/sectors" },
      { label: "Asset & wealth management", href: "/sectors" },
      { label: "Insurers", href: "/sectors" },
    ],
  },
  {
    label: "who we are",
    href: "/about",
    items: [
      { label: "About us", href: "/about" },
      { label: "Our culture", href: "/about/culture" },
      { label: "Your career", href: "/careers" },
      { label: "Social responsibility", href: "/about/social-responsibility" },
      { label: "Business consulting partners", href: "/about/consulting-partners" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
