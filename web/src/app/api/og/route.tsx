import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Docmaker").slice(0, 60);
  const subtitle = (searchParams.get("subtitle") || "Documents, done smoothly.").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #121660 0%, #1a1f6e 100%)",
        }}
      >
        <div style={{ color: "#FFD140", fontSize: 20, fontWeight: 700, letterSpacing: 2, marginBottom: 40 }}>
          DOCMAKER
        </div>
        <div style={{ color: "white", fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ color: "#FFD140", fontSize: 64, fontWeight: 800, lineHeight: 1.1, marginBottom: 30 }}>smoothly.</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 24 }}>{subtitle}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
