---
name: video-production-pipeline
description: Produce branded teaching and marketing videos repeatably from one storyboard. Claude writes the script, motion graphics, and Remotion composition; ElevenLabs supplies the cloned voice-over; Kling supplies AI b-roll. Use when the user wants to turn an article, recap, deck, or topic into a narrated YouTube or social video, or wants a reusable video workflow to teach subjects and brand clients.
origin: ECC
---

# Video Production Pipeline

Turn a topic into a finished, on-brand video without rebuilding the process each time.
Two files drive every stage: a `storyboard.json` (the subject) and a `brand.json` (the
client). Swap the storyboard for a new subject, swap the brand kit for a new client, run
the same render command. Everything else is generated.

## When to Activate

- the user wants a narrated video from an article, recap, deck, transcript, or topic
- the user wants their own (cloned) voice over motion graphics and AI b-roll
- the user wants a repeatable video system to teach multiple subjects or brand clients
- the user references ElevenLabs, Kling, Remotion, "faceless video", or "explainer"

## The Two Files That Control Everything

| File | Scope | Validated by |
|------|-------|--------------|
| `storyboard.json` | one subject / episode | `schemas/storyboard.schema.json` |
| `brand.json` | one client's visual system | `schemas/brand-kit.schema.json` |

The storyboard is the single source of truth. The voice step, the b-roll step, and the
renderer all read from it. Never let numbers or claims live only in someone's head — if a
fact is not in the storyboard, it does not go on screen.

## Pipeline

Stages 0 to 4 are engine-agnostic. Stage 5 to 6 assume Remotion because that is where
Claude authors the most (the assembly is code, not manual editing).

**Stage 0 — Brief and fact-lock (Claude).**
Collect the topic, the approved facts, the target length, the aspect ratio, and the brand
kit. Write down every number and claim. This list is the fact-lock (see below).

**Stage 1 — Script and storyboard (Claude).**
Write the narration in spoken cadence and break it into scenes. Emit `storyboard.json`:
per scene, the `vo` line, the on-screen `graphic` (type + props), the `broll` prompt, the
`accent` (primary vs secondary), and the `background` (ink vs paper). Obey the brand's
voice rules; headlines are claims backed by a number.

**Stage 2 — Narration (ElevenLabs).**
Render each scene's `vo` through the cloned voice using the **with-timestamps** endpoint.
Save `audio/scene-XX.mp3` and `audio/scene-XX.words.json` (word-level timings). Write the
measured length back into each scene's `durationSeconds`. The timestamps are what let
captions and graphic reveals sync to the voice automatically — do not skip them.

**Stage 3 — B-roll (Kling).**
Send each scene's `broll.prompt` (+ `negativePrompt`, a fixed `seed`, and the shared style
suffix) to Kling. Save `broll/scene-XX.mp4` and write the path into `broll.file`. Reuse
one seed and one style suffix across a series so clips look like one show.

**Stage 4 — Motion graphics (Claude).**
Implement each `graphic.type` as a Remotion component reading brand tokens. Reuse the
"Electric Studio" motion language: reveals, count-ups, line/timeline draws, stagger. These
are the same techniques as the scrollytelling web system, retimed onto a video timeline.

**Stage 5 — Composition (Remotion).**
`Episode.tsx` maps `storyboard.scenes` to `<Sequence>`s; each scene mounts its background,
b-roll (`<OffthreadVideo>`), graphic, per-scene `<Audio>`, and timestamp-driven captions.
Scene timing comes from `durationSeconds`.

**Stage 6 — Render (Remotion CLI or Lambda).**
`npx remotion render Episode out/episode.mp4`. Music is mixed on the timeline; captions and
chapter markers derive from the word timings. Cloud renders use `@remotion/lambda`.

**Stage 7 — Package (Claude).**
Generate the title, description, chapter list (from scene start times), tags, and a
thumbnail (HTML rendered to PNG). Hand off for upload.

## Fact-Lock (non-negotiable)

- Every number and named claim in any `vo` line or graphic must trace to the Stage 0 brief.
- Never invent metrics, dates, prices, or outcomes. If a value is unknown, leave it out.
- Label anything future or aspirational as a target or plan, never as an accomplished fact.
- Include a disclaimer scene when the content is financial, medical, or legal.

## Reusability Model

- **New subject** → new `storyboard.json`, same `brand.json`, same components, same command.
- **New client** → new `brand.json`; the storyboard and components are untouched.
- **New format** (9:16 shorts) → change `aspect`, `width`, `height`; components are responsive.
- Keep everything in git. Every episode is then reproducible, diffable, and reviewable.

## What Claude Produces vs. What Runs Externally

Claude authors: the brief, the script, the full `storyboard.json`, every Kling prompt,
every Remotion component, the render config, and all publish copy. External, key-gated
steps: ElevenLabs renders the voice, Kling renders the clips, a machine runs the render.
Claude cannot call ElevenLabs or Kling itself — it writes the exact calls to run.

## Definition of Done

- [ ] `storyboard.json` validates against the schema; `brand.json` validates against its schema
- [ ] Every on-screen number and claim traces to the brief; targets labelled as targets
- [ ] Voice rendered with word timestamps; `durationSeconds` filled per scene
- [ ] B-roll clips present with a consistent seed and style; paths written back
- [ ] Captions and reveals track the narration; accent colour stays semantic
- [ ] Render produces the MP4 at the target resolution; chapters and description generated

## Related

- `commands/video-episode.md` — invoke the workflow for one episode
- `docs/VIDEO-PIPELINE-RUNBOOK.md` — the actual ElevenLabs / Kling / Remotion commands
- `examples/video-episodes/biolabs-ep1/` — a full worked episode
- `skills/brand-voice` — derive the narration voice from real source material
