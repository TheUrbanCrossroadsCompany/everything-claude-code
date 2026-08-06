import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { accent, accentTint, fg, hair, muted, reveal } from "./helpers";

// Close (ink): the positioning line, a contact block, the Web20 attendee code, disclaimer.
export const Cta: React.FC<any> = ({ headline, sub, contact, attendee, disclaimer, scene, brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = accent(scene, brand);
  const text = fg(scene, brand);
  const mut = muted(scene, brand);
  const line = hair(scene, brand);

  // "Biopharma upside. Device-grade downside protection." -> two lines.
  const headLines = (headline ?? "")
    .split(". ")
    .map((l: string, i: number, arr: string[]) => (i < arr.length - 1 ? l + "." : l));

  // Highlight the attendee code inline.
  const parts = (attendee ?? "").split("Web20");

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 7%", color: text }}>
      <div style={{ fontWeight: 800, fontSize: 78, letterSpacing: -1.5, lineHeight: 1.04 }}>
        {headLines.map((l: string, i: number) => (
          <div key={i} style={reveal(frame, fps, i * 0.12)}>
            {l}
          </div>
        ))}
      </div>

      <div style={{ ...reveal(frame, fps, 0.3), color: mut, fontSize: 27, marginTop: 20, maxWidth: 1050 }}>{sub}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, marginTop: 44, paddingTop: 28, borderTop: `1px solid ${line}` }}>
        <div style={reveal(frame, fps, 0.44)}>
          <div style={{ color: a, fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Contact</div>
          <div style={{ fontSize: 22, maxWidth: 460 }}>{contact}</div>
        </div>
        <div style={reveal(frame, fps, 0.54)}>
          <div style={{ color: a, fontWeight: 800, fontSize: 15, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Attendees</div>
          <div style={{ fontSize: 22, maxWidth: 460 }}>
            {parts[0]}
            <span style={{ color: a, background: accentTint(scene, brand, 0.14), fontWeight: 800, padding: "2px 8px", borderRadius: 6 }}>Web20</span>
            {parts[1]}
          </div>
        </div>
      </div>

      <div style={{ ...reveal(frame, fps, 0.7), color: mut, fontSize: 16, marginTop: 30, maxWidth: 1150, lineHeight: 1.5 }}>{disclaimer}</div>
    </AbsoluteFill>
  );
};
