import React from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Word = { word: string; start: number; end: number };
type Line = { text: string; start: number; end: number };

const WORDS_PER_LINE = 7;

// Reads the ElevenLabs word timings for this scene and shows the caption line
// whose time range contains the current frame. This is the payoff of the
// with-timestamps endpoint: captions track the voice with zero manual timing.
export const Captions: React.FC<{ srcWords: string; brand: any }> = ({ srcWords, brand }) => {
  const [words, setWords] = React.useState<Word[] | null>(null);
  const [handle] = React.useState(() => delayRender(`words:${srcWords}`));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  React.useEffect(() => {
    let alive = true;
    fetch(staticFile(srcWords))
      .then((r) => r.json())
      .then((w: Word[]) => {
        if (alive) setWords(w);
        continueRender(handle);
      })
      .catch(() => continueRender(handle)); // no words file yet -> render without captions
    return () => {
      alive = false;
    };
  }, [handle, srcWords]);

  const lines = React.useMemo<Line[]>(() => {
    if (!words) return [];
    const out: Line[] = [];
    for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
      const chunk = words.slice(i, i + WORDS_PER_LINE);
      out.push({
        text: chunk.map((w) => w.word).join(" "),
        start: chunk[0].start,
        end: chunk[chunk.length - 1].end,
      });
    }
    return out;
  }, [words]);

  if (!words) return null;
  const t = frame / fps;
  const current = lines.find((l) => t >= l.start && t <= l.end + 0.3);
  if (!current) return null;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: 90 }}>
      <div
        style={{
          background: "rgba(11,13,18,.72)",
          color: brand.colors.paper,
          padding: "12px 20px",
          borderRadius: 12,
          fontWeight: 500,
          fontSize: 36,
          lineHeight: 1.3,
          maxWidth: "78%",
          textAlign: "center",
        }}
      >
        {current.text}
      </div>
    </AbsoluteFill>
  );
};
