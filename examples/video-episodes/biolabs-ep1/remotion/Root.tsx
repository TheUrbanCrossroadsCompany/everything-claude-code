import React from "react";
import { Composition } from "remotion";
import { Episode } from "./Episode";
import storyboard from "../storyboard.json";
import brand from "../brand.json";

// Total length is the sum of every scene's measured narration length.
// `bin/voice.mjs` writes durationSeconds back into storyboard.json (Stage 2).
const fps = storyboard.fps;
const durationInFrames = Math.max(
  1,
  Math.round(
    storyboard.scenes.reduce((total, s) => total + (s.durationSeconds ?? 5), 0) * fps
  )
);

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Episode"
      component={Episode as React.FC}
      durationInFrames={durationInFrames}
      fps={fps}
      width={storyboard.width}
      height={storyboard.height}
      defaultProps={{ storyboard, brand } as Record<string, unknown>}
    />
  );
};
