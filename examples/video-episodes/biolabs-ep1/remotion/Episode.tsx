import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  OffthreadVideo,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Captions } from "./Captions";
import { HeroTitle } from "./graphics/HeroTitle";
import { StatRow } from "./graphics/StatRow";
import { Split } from "./graphics/Split";
import { Chips } from "./graphics/Chips";
import { Flow } from "./graphics/Flow";
import { Quote } from "./graphics/Quote";
import { Timeline } from "./graphics/Timeline";
import { Cta } from "./graphics/Cta";
import { TitleCard } from "./graphics/TitleCard";

// Map storyboard graphic.type -> component. TitleCard is the fallback for any type
// without a bespoke component (e.g. "stat", "lower-third", "none").
const GRAPHICS: Record<string, React.FC<any>> = {
  "hero-title": HeroTitle,
  "stat-row": StatRow,
  split: Split,
  chips: Chips,
  flow: Flow,
  quote: Quote,
  timeline: Timeline,
  cta: Cta,
};

const pad = (n: number) => String(n).padStart(2, "0");

const Scene: React.FC<{ scene: any; brand: any }> = ({ scene, brand }) => {
  const background = scene.background === "ink" ? brand.colors.ink : brand.colors.paper;
  const id = pad(scene.id);
  const Graphic = GRAPHICS[scene.graphic?.type] ?? TitleCard;
  const broll = scene.broll;
  const hasBroll = broll && broll.provider !== "none" && broll.file;

  return (
    <AbsoluteFill style={{ backgroundColor: background }}>
      {hasBroll ? (
        <AbsoluteFill style={{ opacity: broll.opacity ?? 1 }}>
          <OffthreadVideo
            src={staticFile(broll.file)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : null}

      <Graphic {...(scene.graphic?.props ?? {})} scene={scene} brand={brand} />

      {/* Narration + captions are added after Stage 2 renders the audio. */}
      <Audio src={staticFile(`audio/scene-${id}.mp3`)} />
      <Captions srcWords={`audio/scene-${id}.words.json`} brand={brand} />
    </AbsoluteFill>
  );
};

export const Episode: React.FC<{ storyboard: any; brand: any }> = ({ storyboard, brand }) => {
  const { fps } = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill
      style={{ backgroundColor: brand.colors.paper, fontFamily: brand.fonts.body }}
    >
      {storyboard.scenes.map((scene: any) => {
        const durationInFrames = Math.round((scene.durationSeconds ?? 5) * fps);
        const node = (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
            name={`S${scene.id} ${scene.name ?? ""}`}
          >
            <Scene scene={scene} brand={brand} />
          </Sequence>
        );
        from += durationInFrames;
        return node;
      })}
    </AbsoluteFill>
  );
};
