import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { accent, accentTint, fg, hair, muted, reveal } from "./helpers";

// East Asia (ink). Three supporting points + a set-off callout for the 5% royalty pool.
export const Quote: React.FC<any> = ({ eyebrow, headline, points = [], callout, scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);
  const mut = muted(scene, brand);
  const line = hair(scene, brand);

  const big: string = callout?.big ?? "";
  const firstSpace = big.indexOf(" ");
  const bigHead = firstSpace > 0 ? big.slice(0, firstSpace) : big;
  const bigRest = firstSpace > 0 ? big.slice(firstSpace) : "";

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text }}>
      <div style={{ ...reveal(frame, fps, 0), color: a, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", fontSize: 20 }}>
        {eyebrow}
      </div>
      <div style={{ ...reveal(frame, fps, 0.12), fontWeight: 800, fontSize: 74, letterSpacing: -1, margin: "10px 0 40px", maxWidth: 1150 }}>
        {headline}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 60, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 22 }}>
          {points.map((p: any, i: number) => (
            <div key={i} style={{ ...reveal(frame, fps, 0.3 + i * 0.1), borderTop: `1px solid ${line}`, paddingTop: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 6 }}>{p.h}</div>
              <div style={{ color: mut, fontSize: 22 }}>{p.body}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            ...reveal(frame, fps, 0.5),
            border: `1px solid ${line}`,
            borderLeft: `3px solid ${a}`,
            borderRadius: 12,
            background: accentTint(scene, brand, 0.06),
            padding: 30,
          }}
        >
          <div style={{ color: a, fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
            {callout?.kicker}
          </div>
          <div style={{ fontWeight: 800, fontSize: 34, lineHeight: 1.12 }}>
            <span style={{ color: a }}>{bigHead}</span>
            {bigRest}
          </div>
          <div style={{ color: mut, fontSize: 20, marginTop: 12 }}>{callout?.sub}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
