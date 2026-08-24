import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { geist, outfit, quicksandBrand } from "./fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Spotlight } from "@/components/motion/Spotlight";
import "./globals.css";

const SITE = "https://infinium-technology.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    template: "%s — Infinium Technology",
    default: "Months, not years — Infinium Technology",
  },
  description:
    "Engineering excellence combined with deep industry expertise. Turning data into decisions for the world's leading banks, insurers and asset managers.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Infinium Technology",
    type: "website",
    locale: "en_GB",
    // Next only emits og:url when it is set explicitly
    url: "/",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#F7F9FC",
};

/* Runs before paint: arms the once-per-session load sequence. Fires on
 * DOMContentLoaded, NOT window.load — waiting for images/scripts made the
 * hero copy (the LCP element) invisible for seconds on slow connections. */
const LOAD_SCRIPT = `(function(){try{var d=document.documentElement;if(!sessionStorage.getItem("inf-load")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-load","pending");var go=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){d.setAttribute("data-load","go");sessionStorage.setItem("inf-load","1")})})};document.readyState==="loading"?addEventListener("DOMContentLoaded",go):go()}}catch(e){}})()`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Infinium Technology",
      legalName: "Infinium Consulting B.V.",
      url: SITE,
      logo: `${SITE}/img/logo.png`,
      email: "sales@infinium.technology",
      // head office — Amsterdam. Dubai is a second office, declared below.
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fred Roeskestraat 115",
        addressLocality: "Amsterdam",
        addressCountry: "NL",
      },
      sameAs: ["https://www.linkedin.com/company/113267940/"],
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#office-amsterdam`,
      name: "Infinium Consulting B.V.",
      parentOrganization: { "@id": `${SITE}/#org` },
      url: `${SITE}/about/amsterdam`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fred Roeskestraat 115",
        addressLocality: "Amsterdam",
        addressCountry: "NL",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#office-dubai`,
      name: "Infinium Technology Ltd",
      parentOrganization: { "@id": `${SITE}/#org` },
      url: `${SITE}/about/dubai`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Level 02, Innovation One, Dubai International Financial Centre",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#site`,
      url: SITE,
      name: "Infinium Technology",
      publisher: { "@id": `${SITE}/#org` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${outfit.variable} ${quicksandBrand.variable}`}
    >
      <body>
        <Script id="load-seq" strategy="beforeInteractive">
          {LOAD_SCRIPT}
        </Script>
        <div aria-hidden className="site-backdrop" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-cobalt focus:px-4 focus:py-2 focus:font-mono focus:text-(length:--text-label) focus:uppercase focus:tracking-[0.08em] focus:text-white"
        >
          Skip to content
        </a>
        <div className="load-nav">
          <Nav />
        </div>
        {/* tabIndex allows the skip link to actually move focus here */}
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Spotlight />
        {/* the injected scripts only exist on Vercel's edge — locally they 404 */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </body>
    </html>
  );
}
