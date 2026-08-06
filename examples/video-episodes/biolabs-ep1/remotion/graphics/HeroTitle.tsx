import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Staggered reveal that mirrors the web system's cubic-bezier(.16,1,.3,1) motion.
const reveal = (frame: number, fps: number, delayFrames: number) => {
  const p = spring({
    frame: frame - delayFrames,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  return { opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)` };
};

export const HeroTitle: React.FC<any> = ({
  eyebrow,
  title,
  sub,
  speakers = [],
  location,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => Math.round(d * fps);

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 8%", color: brand.colors.paper }}>
      <div
        style={{
          ...reveal(frame, fps, s(0)),
          color: brand.colors.accentPrimaryBright,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontSize: 22,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          ...reveal(frame, fps, s(0.2)),
          fontWeight: brand.fonts.displayWeight ?? 800,
          letterSpacing: -2,
          fontSize: 128,
          lineHeight: 1,
          margin: "12px 0",
        }}
      >
        {title}
      </div>
      <div
        style={{
          ...reveal(frame, fps, s(0.4)),
          color: "rgba(247,247,244,.72)",
          fontSize: 34,
          maxWidth: 900,
        }}
      >
        {sub}
      </div>
      <div style={{ ...reveal(frame, fps, s(0.6)), marginTop: 28, fontSize: 26, fontWeight: 500 }}>
        {speakers.join("     ·     ")}
      </div>
      <div
        style={{
          ...reveal(frame, fps, s(0.72)),
          marginTop: 8,
          color: "rgba(247,247,244,.55)",
          fontSize: 20,
        }}
      >
        {location}
      </div>
    </AbsoluteFill>
  );
};
