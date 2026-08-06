#!/usr/bin/env node
/**
 * Stage 2 — narration with word timestamps (ElevenLabs).
 * Run from the episode directory:  node bin/voice.mjs
 *
 * Reads storyboard.json, renders each scene's `vo` through your cloned voice using the
 * with-timestamps endpoint, writes audio/scene-XX.mp3 + audio/scene-XX.words.json, and
 * writes the measured length back into each scene's durationSeconds.
 *
 * Requires: Node >= 18 (built-in fetch) and ELEVENLABS_API_KEY.
 */
import fs from "node:fs/promises";
import path from "node:path";

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error("Set ELEVENLABS_API_KEY in your environment.");
  process.exit(1);
}

const SB_PATH = path.resolve("storyboard.json");
const sb = JSON.parse(await fs.readFile(SB_PATH, "utf8"));

if (!sb.voice?.voiceId || sb.voice.voiceId.startsWith("REPLACE_")) {
  console.error("Set storyboard.voice.voiceId to your cloned ElevenLabs voice id first.");
  process.exit(1);
}

await fs.mkdir("public/audio", { recursive: true });

// Group per-character alignment into words on whitespace boundaries.
function charsToWords(alignment) {
  const chars = alignment?.characters ?? [];
  const starts = alignment?.character_start_times_seconds ?? [];
  const ends = alignment?.character_end_times_seconds ?? [];
  const words = [];
  let cur = null;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch.trim() === "") {
      if (cur) {
        words.push(cur);
        cur = null;
      }
      continue;
    }
    if (!cur) cur = { word: "", start: starts[i], end: ends[i] };
    cur.word += ch;
    cur.end = ends[i];
  }
  if (cur) words.push(cur);
  return words;
}

for (const scene of sb.scenes) {
  const id = String(scene.id).padStart(2, "0");
  process.stdout.write(`voice: scene ${id} ... `);

  const voiceSettings = {
    stability: sb.voice.stability ?? 0.5,
    similarity_boost: sb.voice.similarityBoost ?? 0.75,
  };
  if ((sb.voice.speed ?? 1) !== 1) voiceSettings.speed = sb.voice.speed;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${sb.voice.voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "content-type": "application/json" },
      body: JSON.stringify({
        text: scene.vo,
        model_id: sb.voice.modelId ?? "eleven_multilingual_v2",
        voice_settings: voiceSettings,
      }),
    }
  );

  if (!res.ok) {
    console.error(`\nElevenLabs ${res.status}: ${await res.text()}`);
    process.exit(1);
  }

  const json = await res.json();
  await fs.writeFile(`public/audio/scene-${id}.mp3`, Buffer.from(json.audio_base64, "base64"));

  const words = charsToWords(json.alignment);
  await fs.writeFile(`public/audio/scene-${id}.words.json`, JSON.stringify(words, null, 2));

  const end = words.at(-1)?.end ?? 2;
  scene.durationSeconds = Math.round((end + 0.4) * 10) / 10; // measured length + short tail
  console.log(`${scene.durationSeconds}s`);
}

await fs.writeFile(SB_PATH, JSON.stringify(sb, null, 2) + "\n");
console.log("done — durations written back to storyboard.json");
