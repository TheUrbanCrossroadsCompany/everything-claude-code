# Video Pipeline Runbook

Concrete commands for the `video-production-pipeline` skill. Everything here runs in **your**
environment with **your** API keys. Claude writes these files and prompts; it does not call
ElevenLabs or Kling for you.

## Prerequisites

```bash
node -v            # >= 18
export ELEVENLABS_API_KEY=...   # ElevenLabs (voice)
export FAL_KEY=...              # fal.ai (Kling b-roll); or use the official Kling API
npm i -D remotion @remotion/cli @remotion/media-utils
npm i @elevenlabs/elevenlabs-js @fal-ai/client
```

Project layout per episode:

```text
episode/
  storyboard.json          # subject   (schemas/storyboard.schema.json)
  brand.json               # client    (schemas/brand-kit.schema.json)
  audio/  scene-01.mp3  scene-01.words.json ...
  broll/  scene-01.mp4 ...
  remotion/  Root.tsx  Episode.tsx  graphics/*  Captions.tsx
  out/    episode.mp4
```

## Stage 2 — Narration with word timestamps (ElevenLabs)

The `with-timestamps` endpoint returns audio **and** per-character timings. Group them into
words so captions and reveals can sync. Reference `bin/voice.mjs`:

```js
import fs from "node:fs/promises";

const KEY = process.env.ELEVENLABS_API_KEY;
const sb = JSON.parse(await fs.readFile("storyboard.json", "utf8"));

function charsToWords(a) {
  const words = []; let cur = null;
  a.characters.forEach((ch, i) => {
    const s = a.character_start_times_seconds[i], e = a.character_end_times_seconds[i];
    if (ch.trim() === "") { if (cur) { words.push(cur); cur = null; } return; }
    if (!cur) cur = { word: "", start: s, end: e };
    cur.word += ch; cur.end = e;
  });
  if (cur) words.push(cur);
  return words;
}

for (const scene of sb.scenes) {
  const r = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${sb.voice.voiceId}/with-timestamps`,
    { method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({
        text: scene.vo,
        model_id: sb.voice.modelId ?? "eleven_multilingual_v2",
        voice_settings: { stability: sb.voice.stability ?? 0.5,
                          similarity_boost: sb.voice.similarityBoost ?? 0.75 }
      }) });
  const j = await r.json();
  const id = String(scene.id).padStart(2, "0");
  await fs.writeFile(`audio/scene-${id}.mp3`, Buffer.from(j.audio_base64, "base64"));
  const words = charsToWords(j.alignment);
  await fs.writeFile(`audio/scene-${id}.words.json`, JSON.stringify(words, null, 2));
  scene.durationSeconds = Math.ceil((words.at(-1)?.end ?? 2) * 10) / 10 + 0.4; // + tail
}
await fs.writeFile("storyboard.json", JSON.stringify(sb, null, 2)); // durations written back
```

```bash
node bin/voice.mjs
```

Clone your voice first in the ElevenLabs dashboard (Instant or Professional Voice Clone),
copy its `voiceId` into `storyboard.json`, and use a commercial-tier plan for published work.

## Stage 3 — B-roll clips (Kling)

Kling makes 5 to 10 second clips. Keep one `seed` and one style suffix per series for a
consistent look. Reference `bin/broll.mjs` (via fal.ai):

```js
import { fal } from "@fal-ai/client";
import fs from "node:fs/promises";
fal.config({ credentials: process.env.FAL_KEY });

const STYLE = ", editorial, cinematic, cool cobalt and near-black palette, minimal, " +
              "shallow depth of field, subtle motion, no text, no logos";
const sb = JSON.parse(await fs.readFile("storyboard.json", "utf8"));

for (const scene of sb.scenes) {
  if (!scene.broll || scene.broll.provider === "none") continue;
  const res = await fal.subscribe("fal-ai/kling-video/v1/standard/text-to-video", {
    input: {
      prompt: scene.broll.prompt + STYLE,
      negative_prompt: scene.broll.negativePrompt ?? "text, watermark, logo, distortion",
      duration: String(scene.broll.durationSeconds ?? 5),
      aspect_ratio: sb.episode.aspect ?? "16:9",
      // seed: scene.broll.seed  // set if the model build exposes it
    }
  });
  const id = String(scene.id).padStart(2, "0");
  const buf = Buffer.from(await (await fetch(res.data.video.url)).arrayBuffer());
  await fs.writeFile(`broll/scene-${id}.mp4`, buf);
  scene.broll.file = `broll/scene-${id}.mp4`;
}
await fs.writeFile("storyboard.json", JSON.stringify(sb, null, 2));
```

```bash
node bin/broll.mjs
```

Check the current model slug on your provider — Kling ships new builds often (v1 standard,
v1.5, pro). Official access is via the Kuaishou Kling API; aggregators (fal.ai, Replicate,
PiAPI) wrap it with simpler auth. Cost is per second of output — budget accordingly.

## Stage 5 to 6 — Compose and render (Remotion)

The Remotion project reads `storyboard.json` + `brand.json` and mounts each scene. See the
worked components in `examples/video-episodes/biolabs-ep1/remotion/`.

```bash
npx remotion studio              # preview and scrub the timeline
npx remotion render Episode out/episode.mp4 --codec=h264 --concurrency=4
```

Cloud render (no local GPU, parallel):

```bash
npx remotion lambda render <serve-url> Episode
```

## Captions and chapters

- **Captions**: `Captions.tsx` reads `audio/scene-XX.words.json` and shows words as the
  narration hits them. Burned-in, or export SRT for a soft track.
- **YouTube chapters**: generate from scene start times (first must be `00:00`):

```text
00:00 Intro
00:14 The business today
00:41 Proteins, not ctDNA
...
```

## Music

Add a bed on the Remotion timeline with `<Audio src={music} volume={f => ...} />`, ducked
under narration per `storyboard.music`. FFmpeg fallback for a final mix:

```bash
ffmpeg -i out/episode.mp4 -i music.mp3 -filter_complex \
  "[1:a]volume=-22dB[m];[0:a][m]amix=inputs=2:duration=first" -c:v copy out/final.mp4
```

## Time and cost, rough

- Voice: seconds per scene; cheapest stage.
- B-roll: the slow, metered stage — a few clips can take minutes and dominate cost.
- Render: minutes locally per finished minute; seconds on Lambda with concurrency.

## Gotchas

- Kling clip length is short; cover long scenes with a graphic and a shorter b-roll insert.
- Regenerate `words.json` whenever a `vo` line changes, or captions drift.
- Keep `seed` + style suffix fixed across a series, or episodes will not look related.
- Voice cloning must be **your** voice (or one you have rights to); keep the consent record.
