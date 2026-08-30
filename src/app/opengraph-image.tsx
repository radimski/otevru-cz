import { ImageResponse } from "next/og";
import { otevruConfig } from "@/config/site";

export const runtime = "edge";
export const alt = `${otevruConfig.brand} — zámečnická pohotovost Frýdek-Místek`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #004c93 0%, #282b34 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#acf53d",
          }}
        >
          {otevruConfig.brand}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
            Zámečnická pohotovost
          </div>
          <div style={{ fontSize: 32, color: "rgba(255,255,255,0.85)" }}>
            Frýdek-Místek · Sviadnov · okolí Ostravy
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
          {otevruConfig.phone}
        </div>
      </div>
    ),
    { ...size },
  );
}
