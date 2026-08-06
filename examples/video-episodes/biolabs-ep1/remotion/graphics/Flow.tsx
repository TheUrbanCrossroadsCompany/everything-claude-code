import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { accent, fg, reveal } from "./helpers";

// Longevity pilot. accent() resolves to the secondary (teal) thread because the
// scene sets accent: "secondary" — colour stays semantic without hardcoding teal.
export const Flow: React.FC<any> = ({ eyebrow, headline, steps = [], note, scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text }}>
      <div style={{ ...reveal(frame, fps, 0), color: a, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 20 }}>
        {eyebrow}
      </div>
      <div style={{ ...reveal(frame, fps, 0.12), fontWeight: 800, fontSize: 70, letterSpacing: -1, margin: "10px 0 44px", maxWidth: 1150 }}>
        {headline}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 60 }}>
        {steps.map((s: any, i: number) => (
          <div key={i} style={{ ...reveal(frame, fps, 0.3 + i * 0.12), position: "relative", borderTop: `3px solid ${a}`, paddingTop: 16 }}>
            <div style={{ color: a, fontWeight: 800, fontSize: 18, letterSpacing: 2, marginBottom: 10 }}>{s.n}</div>
            <div style={{ fontWeight: 800, fontSize: 30, marginBottom: 8 }}>
              {s.title}
              {s.tag ? (
                <span
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: a,
                    border: `1px solid ${a}`,
                    borderRadius: 4,
                    padding: "3px 7px",
                    verticalAlign: "middle",
                  }}
                >
                  {s.tag}
                </span>
              ) : null}
            </div>
            <div style={{ color: brand.colors.muted, fontSize: 22, lineHeight: 1.4 }}>{s.body}</div>
            {i < steps.length - 1 ? (
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  right: -38,
                  width: 14,
                  height: 14,
                  borderTop: `3px solid ${a}`,
                  borderRight: `3px solid ${a}`,
                  transform: "rotate(45deg)",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ ...reveal(frame, fps, 0.7), marginTop: 44, display: "inline-flex", alignItems: "center", gap: 14, color: a, fontWeight: 500, fontSize: 24 }}>
        <span style={{ width: 30, height: 2, background: a, display: "inline-block" }} />
        {note}
      </div>
    </AbsoluteFill>
  );
};
