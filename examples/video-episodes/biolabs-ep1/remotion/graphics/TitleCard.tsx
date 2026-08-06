import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Fallback graphic for scene types not yet given a bespoke component
// (split, chips, flow, timeline, quote, cta). Claude generates those per
// episode the same way HeroTitle and StatRow are built; until then the
// timeline still renders a clean, on-brand card so previews never break.
export const TitleCard: React.FC<any> = ({ eyebrow, headline, scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  const onInk = scene?.background === "ink";
  const accent =
    scene?.accent === "secondary"
      ? onInk ? brand.colors.accentSecondaryBright : brand.colors.accentSecondary
      : onInk ? brand.colors.accentPrimaryBright : brand.colors.accentPrimary;
  const textColor = onInk ? brand.colors.paper : brand.colors.text;

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 8%", color: textColor }}>
      <div
        style={{
          opacity: p,
          color: accent,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: "uppercase",
          fontSize: 20,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
          fontWeight: 800,
          fontSize: 74,
          letterSpacing: -1,
          lineHeight: 1.05,
          marginTop: 14,
          maxWidth: 1200,
        }}
      >
        {headline}
      </div>
    </AbsoluteFill>
  );
};
