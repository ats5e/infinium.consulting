import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { inter, outfit, plexMono } from "./fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const SITE = "https://infinium-technology.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    template: "%s — Infinium Technology",
    default: "Infinium Technology — Data engineering. For tomorrow.",
  },
  description:
    "Financial-services-only technology firm in the DIFC. Data engineering, data science, digital transformation and governance — with proprietary platforms QBricks and TBricks in production at tier-1 institutions.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Infinium Technology",
    type: "website",
    locale: "en_GB",
  },
};

/* Runs before paint: arms the once-per-session load sequence. */
const LOAD_SCRIPT = `(function(){try{var d=document.documentElement;if(!sessionStorage.getItem("inf-load")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-load","pending");var go=function(){requestAnimationFrame(function(){requestAnimationFrame(function(){d.setAttribute("data-load","go");sessionStorage.setItem("inf-load","1")})})};document.readyState==="complete"?go():addEventListener("load",go)}}catch(e){}})()`;

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "Infinium Technology",
      url: SITE,
      email: "sales@infinium.technology",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Level 02, Innovation One, Dubai International Financial Centre",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
      sameAs: ["https://www.linkedin.com/company/113267940/"],
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
      className={`${outfit.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <Script id="load-seq" strategy="beforeInteractive">
          {LOAD_SCRIPT}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-cobalt focus:px-4 focus:py-2 focus:font-mono focus:text-(length:--text-label) focus:uppercase focus:tracking-[0.14em] focus:text-paper"
        >
          Skip to content
        </a>
        <div className="load-nav">
          <Nav />
        </div>
        <main id="main">{children}</main>
        <Footer />
        <SmoothScroll />
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
