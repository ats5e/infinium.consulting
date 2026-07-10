import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Infinium Technology — Data engineering. For tomorrow.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Hero object left (baked into og-base.jpg at Phase 3), lockup composited
 * into the negative space on the right — per the asset spec. */
export default async function OGImage() {
  const [bg, outfit] = await Promise.all([
    readFile(path.join(process.cwd(), "design/og-base.jpg")),
    readFile(path.join(process.cwd(), "design/fonts/Outfit-500.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#05070C",
          backgroundImage: `url(data:image/jpeg;base64,${bg.toString("base64")})`,
          backgroundSize: "1200px 630px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 640,
            maxWidth: 520,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <svg width="56" height="58" viewBox="0 0 100 104" fill="none">
              <path d="M50 4 L90 27 L50 50 L10 27 Z" fill="#CDDEF1" />
              <path d="M10 27 L50 50 L50 100 L10 77 Z" fill="#22365D" />
              <path d="M90 27 L50 50 L50 100 L90 77 Z" fill="#365EEE" />
            </svg>
            <span style={{ fontFamily: "Outfit", fontSize: 52, color: "#FFFFFF", letterSpacing: -1 }}>
              Infinium
            </span>
          </div>
          <span
            style={{
              marginTop: 28,
              fontFamily: "Outfit",
              fontSize: 30,
              lineHeight: 1.25,
              color: "#9AC7F8",
            }}
          >
            Data engineering. For tomorrow.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Outfit", data: outfit, weight: 500, style: "normal" }],
    }
  );
}
