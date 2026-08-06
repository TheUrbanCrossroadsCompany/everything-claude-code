# Example — BioLabs Investor Recap, Episode 1

A full worked episode for the `video-production-pipeline` skill. It turns the 20/20 BioLabs
webinar recap into a ~110s narrated video: your cloned voice over motion graphics and Kling
b-roll, composed and rendered with Remotion.

This example ships the parts Claude authors. The voice and b-roll assets are generated in
**your** environment (they need your API keys) — see `docs/VIDEO-PIPELINE-RUNBOOK.md`.

## What's here

```text
brand.json          # Electric Studio kit (validates: schemas/brand-kit.schema.json)
storyboard.json     # 8 scenes, fact-locked (validates: schemas/storyboard.schema.json)
script.md           # the narration, read-aloud
kling-prompts.md    # one b-roll prompt per scene, shared seed + style
remotion/           # the composition Claude wrote
  index.ts  Root.tsx  Episode.tsx  Captions.tsx
  graphics/ HeroTitle.tsx  StatRow.tsx  TitleCard.tsx
```

Generated later, not committed:

```text
audio/scene-01.mp3  audio/scene-01.words.json  ...   (Stage 2, ElevenLabs)
broll/scene-01.mp4  ...                              (Stage 3, Kling)
out/episode.mp4                                       (Stage 6, Remotion)
```

## Run it

1. Put `brand.json`, `storyboard.json`, and `remotion/` into a Remotion project; set
   `remotion/index.ts` as the entry. Add `audio/` and `broll/` to the `public/` dir so
   `staticFile()` resolves them.
2. Clone your voice in ElevenLabs; paste its id into `storyboard.json` → `voice.voiceId`.
3. `node bin/voice.mjs` — renders narration + word timings, writes `durationSeconds` back.
4. `node bin/broll.mjs` — renders Kling clips, writes each `broll.file` back.
5. `npx remotion studio` to preview, then
   `npx remotion render Episode out/episode.mp4 --codec=h264`.

## Notes

- `HeroTitle` and `StatRow` are fully built; `split`, `chips`, `flow`, `timeline`, `quote`,
  and `cta` fall back to `TitleCard` until you generate them (same pattern — ask Claude).
- Every number in `storyboard.json` traces to the source brief. 2028 Medicare and the fall
  FDA meeting are labelled targets/plans. Scene 8 carries the disclaimer.
- Cobalt is the core-business accent; teal appears only in Scene 5 (the longevity pilot).
- To rebrand this episode for another client, swap `brand.json` — nothing else changes.
- To teach a different subject, write a new `storyboard.json` — the components are reused.
