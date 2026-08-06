---
description: Produce one branded video episode from a topic — script, storyboard, voice, b-roll, motion graphics, and a Remotion render
---

Drive the `video-production-pipeline` skill for a single episode. Load that skill for the
full contract; this command is the running order.

## Inputs to collect first

- the subject (article, recap, deck, transcript, or topic)
- the approved facts (the fact-lock — every number and claim, nothing else)
- the client / brand kit (`brand.json`), target length, and aspect ratio
- the ElevenLabs `voiceId` for the cloned voice

If any of these is missing, ask before writing the storyboard — do not invent facts.

## Phases

### 1. Brief and fact-lock

- restate the topic and list every approved number and claim
- confirm targets/plans are labelled as such, not as accomplished facts
- pick primary vs secondary accent meaning for this brand

### 2. Script and storyboard

- write the narration in spoken cadence, obeying the brand voice rules
- emit `storyboard.json` (validate against `schemas/storyboard.schema.json`)
- each scene: `vo`, `graphic` (type + props), `broll` prompt, `accent`, `background`

### 3. Voice (external)

- run `bin/voice.mjs` (ElevenLabs with-timestamps) — see the runbook
- confirm `audio/scene-XX.mp3` + `words.json` exist and `durationSeconds` is filled

### 4. B-roll (external)

- run `bin/broll.mjs` (Kling) with a fixed seed + shared style suffix
- confirm `broll/scene-XX.mp4` exists and `broll.file` is written back

### 5. Motion graphics and composition

- implement each `graphic.type` as a Remotion component reading `brand.json`
- wire scenes in `Episode.tsx`; captions track `words.json`

### 6. Render and package

- `npx remotion render Episode out/episode.mp4`
- generate title, description, chapters (from scene start times), tags, thumbnail

## Definition of done

Use the checklist in the `video-production-pipeline` skill. Do not mark done until the MP4
renders at the target resolution and every on-screen fact traces to the brief.

## References

- `skills/video-production-pipeline/SKILL.md`
- `docs/VIDEO-PIPELINE-RUNBOOK.md`
- `examples/video-episodes/biolabs-ep1/`
