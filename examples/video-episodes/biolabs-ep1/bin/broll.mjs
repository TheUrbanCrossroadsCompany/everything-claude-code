#!/usr/bin/env node
/**
 * Stage 3 — b-roll clips (Kling via fal.ai).
 * Run from the episode directory:  node bin/broll.mjs   (add --force to re-render all)
 *
 * Reads storyboard.json, sends each scene's broll prompt (+ the shared style suffix) to
 * Kling, saves broll/scene-XX.mp4, and writes the path back into broll.file. Resumable:
 * scenes that already have a clip are skipped unless --force is passed.
 *
 * Requires: FAL_KEY and `npm i @fal-ai/client`. Set KLING_MODEL to pin a different build.
 */
import { fal } from "@fal-ai/client";
import fs from "node:fs/promises";
import path from "node:path";

if (!process.env.FAL_KEY) {
  console.error("Set FAL_KEY in your environment.");
  process.exit(1);
}
fal.config({ credentials: process.env.FAL_KEY });

// Check the current slug on your provider — Kling ships new builds often.
const MODEL = process.env.KLING_MODEL ?? "fal-ai/kling-video/v1/standard/text-to-video";

// Keep this identical across a series so every episode looks like one show.
const STYLE =
  ", editorial, cinematic, cool cobalt and near-black palette, minimal, " +
  "shallow depth of field, subtle motion, no text, no logos";

const SB_PATH = path.resolve("storyboard.json");
const sb = JSON.parse(await fs.readFile(SB_PATH, "utf8"));
await fs.mkdir("public/broll", { recursive: true });

const force = process.argv.includes("--force");

for (const scene of sb.scenes) {
  const b = scene.broll;
  if (!b || b.provider === "none") continue;

  const id = String(scene.id).padStart(2, "0");
  const rel = `broll/scene-${id}.mp4`; // path staticFile() resolves under public/
  const out = `public/${rel}`;

  if (!force && b.file) {
    try {
      await fs.access(out);
      console.log(`broll: scene ${id} exists, skip`);
      continue;
    } catch {
      // fall through and render
    }
  }

  process.stdout.write(`broll: scene ${id} ... `);

  const result = await fal.subscribe(MODEL, {
    input: {
      prompt: b.prompt + STYLE,
      negative_prompt: b.negativePrompt ?? "text, watermark, logo, distortion",
      duration: String(b.durationSeconds ?? 5),
      aspect_ratio: sb.episode.aspect ?? "16:9",
      // seed: b.seed,  // enable if your Kling build exposes a seed input
    },
  });

  const url = result?.data?.video?.url;
  if (!url) {
    console.error(`\nno video url returned: ${JSON.stringify(result?.data)}`);
    process.exit(1);
  }

  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await fs.writeFile(out, buf);
  scene.broll.file = rel;
  console.log("ok");

  // Save progress after each clip so a mid-run failure doesn't lose finished work.
  await fs.writeFile(SB_PATH, JSON.stringify(sb, null, 2) + "\n");
}

console.log("done — clip paths written back to storyboard.json");
