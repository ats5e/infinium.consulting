import type { Metadata } from "next";
import { inter, outfit, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://infinium-technology.com"),
  title: {
    template: "%s — Infinium Technology",
    default: "Infinium Technology — Data engineering. For tomorrow.",
  },
  description:
    "Financial-services-only technology firm in the DIFC. Data engineering, data science, digital transformation and governance — with proprietary platforms QBricks and TBricks in production at tier-1 institutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
