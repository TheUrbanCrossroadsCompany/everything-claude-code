import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { accent, fg, hair, reveal, surface } from "./helpers";

// Best-quarter scene: oversized ghost numeral (grid-break), staggered account chips,
// and program status rows.
export const Chips: React.FC<any> = ({ eyebrow, headline, ghost, chips = [], programs = [], scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);
  const line = hair(scene, brand);

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text, overflow: "hidden" }}>
      {ghost ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -40,
            top: 20,
            fontSize: 560,
            fontWeight: 800,
            letterSpacing: -20,
            lineHeight: 0.8,
            color: "#ECECE4",
            zIndex: 0,
            userSelect: "none",
            opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {ghost}
        </div>
      ) : null}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ ...reveal(frame, fps, 0), color: a, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 20 }}>
          {eyebrow}
        </div>
        <div style={{ ...reveal(frame, fps, 0.12), fontWeight: 800, fontSize: 76, letterSpacing: -1, margin: "10px 0 34px", maxWidth: 1000 }}>
          {headline}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, maxWidth: 1150 }}>
          {chips.map((c: string, i: number) => (
            <div
              key={i}
              style={{
                ...reveal(frame, fps, 0.3 + i * 0.08),
                border: `1px solid ${line}`,
                borderRadius: 999,
                padding: "12px 22px",
                fontSize: 24,
                fontWeight: 500,
                background: surface(scene),
              }}
            >
              {c}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 40, maxWidth: 1000 }}>
          {programs.map((p: any, i: number) => (
            <div
              key={i}
              style={{
                ...reveal(frame, fps, 0.5 + i * 0.1),
                display: "flex",
                gap: 14,
                alignItems: "center",
                borderTop: `1px solid ${line}`,
                paddingTop: 16,
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  padding: "5px 10px",
                  borderRadius: 5,
                  color: p.status === "Live" ? "#fff" : brand.colors.muted,
                  background: p.status === "Live" ? a : "transparent",
                  border: p.status === "Live" ? "none" : `1px solid ${line}`,
                }}
              >
                {p.status}
              </span>
              <span style={{ fontSize: 22, fontWeight: 500 }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
