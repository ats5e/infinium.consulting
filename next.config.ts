import type { NextConfig } from "next";

/* Content-Security-Policy.
 *
 * 'unsafe-inline' is required for scripts because the layout injects a
 * beforeInteractive load-sequence script and an inline JSON-LD block; a
 * nonce-based policy would need middleware, which this static export does
 * not use. Tailwind v4 emits inline styles, hence style-src. No
 * 'unsafe-eval' — GSAP and the canvas hero do not need it.
 *
 * Frame/media/img allowances cover the click-to-load Mux and
 * YouTube (nocookie) players in components/OfficeVideo.tsx; connect-src
 * covers Vercel Analytics and Speed Insights.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://image.mux.com",
  "font-src 'self' data:",
  "media-src 'self' blob: https://stream.mux.com",
  "frame-src https://player.mux.com https://www.youtube-nocookie.com",
  "connect-src 'self' https://*.vercel-insights.com https://va.vercel-scripts.com https://stream.mux.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
