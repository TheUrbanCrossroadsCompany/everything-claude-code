# Episode 1 — Kling B-roll Prompts

One prompt per scene. Keep the **shared style suffix** and the **seed** fixed across the
whole series so clips read as one show. B-roll sits *behind* the graphics, so opacity is low
on paper scenes and higher on the dark (ink) scenes.

**Shared style suffix** (appended to every prompt):

```text
, editorial, cinematic, cool cobalt and near-black palette, minimal, shallow depth of field,
subtle motion, no text, no logos
```

**Shared negative prompt:** `text, watermark, logo, faces, distortion, oversaturated`
**Seed:** `2020` (fixed) · **Provider:** Kling via fal.ai (see the runbook)

| # | Scene | Prompt (subject) | Motion | Dur | Opacity |
|---|-------|------------------|--------|-----|---------|
| 1 | Hero | slow abstract macro of a clinical laboratory, concentric focus rings of cool blue light on deep black, particles drifting | slow-push | 5s | 0.50 |
| 2 | Business | abstract dot-grid and a thin rising line graph, cobalt on off-white paper | slow-push | 5s | 0.12 |
| 3 | Proteins | abstract protein and molecular structures drifting, cool blue, dark microscope aesthetic | orbit | 5s | 0.12 |
| 4 | Best quarter | abstract silhouettes of a firefighter jacket and occupational safety gear, cool light | slow-push | 5s | 0.10 |
| 5 | Giant Foods | bright grocery aisle bokeh and fresh produce, warm daylight with teal accents, wellness mood | pan-right | 5s | 0.12 |
| 6 | East Asia | cinematic East Asian city skyline at blue hour, calm, cool tones, slow aerial drift | slow-push | 10s | 0.45 |
| 7 | What's next | abstract vertical line drawing itself downward past glowing nodes, cobalt on paper | static | 5s | 0.10 |
| 8 | Close | abstract concentric cobalt rings resolving to a single focal point on deep black | slow-push | 5s | 0.40 |

## Notes

- Scene 5 is the **longevity thread** — the one place the palette warms toward teal, matching
  the secondary accent. Everything else stays cobalt/near-black.
- Scene 6 runs 10s because the narration is longer; the rest are 5s and can loop or hold on a
  freeze-frame under the graphic if a scene runs long.
- Do not ask Kling for on-screen text or the company logo — those come from the Remotion
  graphics layer, cleanly and on-brand.
- If a build of Kling ignores the seed, lock consistency with the style suffix and a fixed
  first frame (image-to-video) instead.
