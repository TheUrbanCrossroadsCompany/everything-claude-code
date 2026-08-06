import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, accent, fg, hair, reveal, surface } from "./helpers";

// Two-approach comparison + an SVG biomarker trajectory that draws on the timeline.
export const Split: React.FC<any> = ({
  eyebrow,
  headline,
  left,
  right,
  chartCaption,
  pullquote,
  scene,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);
  const line = hair(scene, brand);

  const drawStart = 0.6 * fps;
  const drawEnd = drawStart + 1.4 * fps;
  const dash = interpolate(frame, [drawStart, drawEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const pts: [number, number][] = [
    [30, 118],
    [130, 66],
    [230, 94],
    [330, 50],
    [430, 82],
    [530, 40],
  ];
  const d = "M" + pts.map((p) => p.join(",")).join(" L");

  const Panel = ({ p, primary, delay }: { p: any; primary: boolean; delay: number }) => (
    <div
      style={{
        ...reveal(frame, fps, delay),
        flex: 1,
        background: primary ? "rgba(29,78,216,.05)" : surface(scene),
        border: `1px solid ${primary ? a : line}`,
        borderLeft: primary ? `4px solid ${a}` : `1px solid ${line}`,
        borderRadius: 14,
        padding: 26,
      }}
    >
      <div style={{ color: primary ? a : brand.colors.muted, fontWeight: 800, fontSize: 22, marginBottom: 10 }}>
        {p?.title}
      </div>
      <div style={{ color: text, fontSize: 23, lineHeight: 1.4 }}>{p?.body}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text }}>
      <div style={{ ...reveal(frame, fps, 0), color: a, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 20 }}>
        {eyebrow}
      </div>
      <div style={{ ...reveal(frame, fps, 0.12), fontWeight: 800, fontSize: 70, letterSpacing: -1, margin: "10px 0 30px" }}>
        {headline}
      </div>

      <div style={{ display: "flex", gap: 40, alignItems: "stretch" }}>
        <div style={{ flex: 1.15, display: "flex", gap: 18 }}>
          <Panel p={left} primary={false} delay={0.24} />
          <Panel p={right} primary delay={0.34} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <svg viewBox="0 0 560 150" style={{ width: "100%", height: "auto" }}>
            <line x1="18" y1="132" x2="545" y2="132" stroke={line} strokeWidth="2" />
            <path
              d={d}
              transform="translate(12,0)"
              fill="none"
              stroke={a}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={dash}
            />
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p[0] + 12}
                cy={p[1]}
                r="6.5"
                fill={a}
                stroke={brand.colors.paper}
                strokeWidth="2.5"
                opacity={interpolate(frame, [drawStart + i * 3, drawStart + i * 3 + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
            ))}
          </svg>
          <div style={{ ...reveal(frame, fps, 0.7), color: brand.colors.muted, fontSize: 18, marginTop: 12, maxWidth: 480 }}>
            {chartCaption}
          </div>
        </div>
      </div>

      <div
        style={{
          ...reveal(frame, fps, 0.8),
          marginTop: 28,
          borderLeft: `3px solid ${a}`,
          paddingLeft: 18,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: -0.5,
          maxWidth: 1000,
        }}
      >
        {pullquote}
      </div>
    </AbsoluteFill>
  );
};
