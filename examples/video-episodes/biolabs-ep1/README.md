# Example — BioLabs Investor Recap, Episode 1

A full worked episode for the `video-production-pipeline` skill. It turns the 20/20 BioLabs
webinar recap into a ~110s narrated video: your cloned voice over motion graphics and Kling
b-roll, composed and rendered with Remotion.

This example ships the parts Claude authors. The voice and b-roll assets are generated in
**your** environment (they need your API keys) — see `docs/VIDEO-PIPELINE-RUNBOOK.md`.

## What's here

```text
package.json        # self-contained Remotion project (npm install && npm run render)
remotion.config.ts  # render settings (codec, overwrite)
tsconfig.json
public/             # staticFile() root — generated assets land here (gitignored)
brand.json          # Electric Studio kit (validates: schemas/brand-kit.schema.json)
storyboard.json     # 8 scenes, fact-locked (validates: schemas/storyboard.schema.json)
script.md           # the narration, read-aloud
kling-prompts.md    # one b-roll prompt per scene, shared seed + style
bin/
  voice.mjs         # Stage 2 — ElevenLabs narration + word timestamps
  broll.mjs         # Stage 3 — Kling b-roll clips (resumable)
remotion/           # the composition Claude wrote
  index.ts  Root.tsx  Episode.tsx  Captions.tsx
  graphics/ helpers.ts
            HeroTitle.tsx  StatRow.tsx  Split.tsx  Chips.tsx
            Flow.tsx  Quote.tsx  Timeline.tsx  Cta.tsx  TitleCard.tsx
```

Generated later, not committed (all gitignored):

```text
public/audio/scene-01.mp3  public/audio/scene-01.words.json   (npm run voice)
public/broll/scene-01.mp4  ...                                (npm run broll)
out/episode.mp4                                                (npm run render)
```

## Run it

This folder is a self-contained Remotion project — no setup beyond installing deps.

1. `npm install`
2. Clone your voice in ElevenLabs; paste its id into `storyboard.json` → `voice.voiceId`,
   then export `ELEVENLABS_API_KEY` and `FAL_KEY`.
3. `npm run voice` — narration + word timings into `public/audio/`, writes durations back.
4. `npm run broll` — Kling clips into `public/broll/` (optional; skip for graphics-only).
5. `npm run studio` to preview, or `npm run render` → `out/episode.mp4`.

Or run the whole pipeline in one shot: `npm run video`.

> Run `npm run voice` before rendering — the composition needs the narration audio and the
> measured scene durations. B-roll is optional; without it, scenes fall back to the graphics.

## Notes

- All eight graphic types are built — `hero-title`, `stat-row`, `split`, `chips`, `flow`,
  `quote`, `timeline`, `cta` — sharing motion and semantic colour via `graphics/helpers.ts`.
  `TitleCard` stays as the fallback for any type added later.
- Every number in `storyboard.json` traces to the source brief. 2028 Medicare and the fall
  FDA meeting are labelled targets/plans. Scene 8 carries the disclaimer.
- Cobalt is the core-business accent; teal appears only in Scene 5 (the longevity pilot).
- To rebrand this episode for another client, swap `brand.json` — nothing else changes.
- To teach a different subject, write a new `storyboard.json` — the components are reused.
