import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { geist, outfit, quicksandBrand } from "./fonts";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PointerGlow } from "@/components/motion/PointerGlow";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Spotlight } from "@/components/motion/Spotlight";
import "./globals.css";

const SITE = "https://infinium-technology.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    template: "%s — Infinium Technology",
    default: "Engineering with context — Infinium Technology",
  },
  description:
    "Banking & financial services consultancy. We help the world's leading financial services firms transform their businesses through industry expertise, AI and automation.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Infinium Technology",
    type: "website",
    locale: "en_GB",
  },
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
      className={`${geist.variable} ${outfit.variable} ${quicksandBrand.variable}`}
    >
      <body>
        <Script id="load-seq" strategy="beforeInteractive">
          {LOAD_SCRIPT}
        </Script>
        <PointerGlow />
        <div aria-hidden className="site-backdrop" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-cobalt focus:px-4 focus:py-2 focus:font-mono focus:text-(length:--text-label) focus:uppercase focus:tracking-[0.08em] focus:text-paper"
        >
          Skip to content
        </a>
        <div className="load-nav">
          <Nav />
        </div>
        <main id="main">{children}</main>
        <Footer />
        <SmoothScroll />
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
