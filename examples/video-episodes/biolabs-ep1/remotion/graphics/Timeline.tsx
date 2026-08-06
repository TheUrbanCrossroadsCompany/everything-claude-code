import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { accent, fg, reveal } from "./helpers";

// The cobalt spine fills across the scene; each node lights as the fill passes it.
export const Timeline: React.FC<any> = ({ eyebrow, headline, items = [], scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);
  const n = Math.max(1, items.length);

  const drawStart = 0.5 * fps;
  const drawEnd = Math.max(drawStart + fps, ((scene?.durationSeconds ?? 12) - 0.6) * fps);
  const progress = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text }}>
      <div style={{ ...reveal(frame, fps, 0), color: a, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 20 }}>
        {eyebrow}
      </div>
      <div style={{ ...reveal(frame, fps, 0.12), fontWeight: 800, fontSize: 74, letterSpacing: -1, margin: "10px 0 40px", maxWidth: 1150 }}>
        {headline}
      </div>

      <div style={{ position: "relative" }}>
        {/* spine track + fill */}
        <div style={{ position: "absolute", left: 10, top: 8, bottom: 8, width: 3, background: brand.colors.hairline }} />
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 3,
            background: a,
            transformOrigin: "top center",
            transform: `scaleY(${progress})`,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          {items.map((it: any, i: number) => {
            const reached = progress >= (i + 0.5) / n;
            return (
              <div key={i} style={{ ...reveal(frame, fps, 0.3 + i * 0.12), position: "relative", paddingLeft: 52 }}>
                <span
                  style={{
                    position: "absolute",
                    left: 2,
                    top: 6,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: reached ? a : brand.colors.paper,
                    border: `3px solid ${reached ? a : brand.colors.hairline}`,
                    transition: "none",
                  }}
                />
                <div style={{ color: a, fontWeight: 800, fontSize: 17, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                  {it.date}
                  {it.tag ? (
                    <span
                      style={{
                        marginLeft: 10,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: 1,
                        color: a,
                        border: `1px solid ${a}`,
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      {it.tag}
                    </span>
                  ) : null}
                </div>
                <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: -0.5 }}>{it.title}</div>
                {it.note ? <div style={{ color: brand.colors.muted, fontSize: 21, marginTop: 4, maxWidth: 820 }}>{it.note}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
