import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Frame-driven count-up. Deterministic (same frame -> same value), unlike a
// timer-based DOM count-up, so every render is identical. tabular-nums stops jitter.
const useCountUp = (to: number, decimals: number, startFrame: number, durFrames: number) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [startFrame, startFrame + durFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (to * p).toFixed(decimals);
};

const Stat: React.FC<{ s: any; brand: any; delay: number }> = ({ s, brand, delay }) => {
  const { fps } = useVideoConfig();
  const dur = Math.round(((brand.motion?.countUpMs ?? 1200) / 1000) * fps);
  const decimals = s.decimals ?? 0;
  // Both hooks are always called (range stats animate both bounds together).
  const v1 = useCountUp(s.value, decimals, delay, dur);
  const v2 = useCountUp(s.value2 ?? 0, decimals, delay, dur);

  return (
    <div style={{ borderTop: `3px solid ${brand.colors.accentPrimary}`, paddingTop: 14 }}>
      <div
        style={{
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: -1,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: brand.colors.text,
        }}
      >
        {s.prefix ?? ""}
        {v1}
        {s.value2 != null ? `–${v2}` : ""}
        {s.suffix ?? ""}
      </div>
      <div style={{ marginTop: 12, color: brand.colors.muted, fontSize: 24, fontWeight: 500 }}>
        {s.label}
        {s.tag ? (
          <span
            style={{
              marginLeft: 10,
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: brand.colors.accentPrimary,
              border: `1px solid ${brand.colors.accentPrimary}`,
              borderRadius: 4,
              padding: "3px 7px",
            }}
          >
            {s.tag}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export const StatRow: React.FC<any> = ({ eyebrow, headline, stats = [], brand }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 8%", color: brand.colors.text }}>
      <div
        style={{
          color: brand.colors.accentPrimary,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontSize: 20,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ fontWeight: 800, fontSize: 74, letterSpacing: -1, margin: "12px 0 44px", maxWidth: 1100 }}>
        {headline}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 44 }}>
        {stats.map((s: any, i: number) => (
          <Stat key={i} s={s} brand={brand} delay={Math.round(0.3 * fps) + i * Math.round(0.12 * fps)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
