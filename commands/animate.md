---
description: Recommend an animation style from a customer's logo/website and produce an animated video using the studio pipeline
---

# /animate

Produce a branded animated video (or the direction package for one) from a
customer's brand assets.

## Usage

```text
/animate <logo file or description> <website URL> [duration] [aspect]
```

Examples:

```text
/animate ./assets/acme-logo.png https://acme.com 15s 4:5
/animate "angular neon wordmark" https://hypegym.fit 10s 9:16
```

## What it does

1. Delegates brand analysis and style selection to the
   `animation-director` agent (rules live in
   `skills/animation-styles/SKILL.md`)
2. Presents the primary + alternate style recommendation with rationale
   and a storyboard for approval
3. On approval, builds the deterministic HTML/canvas animation
   (`window.seek(t)`), renders frames via headless Chromium, synthesizes
   the SFX track to match the style's sound palette, and encodes with
   ffmpeg (H.264 Main + AAC; WebM VP8 variant for web embeds)
4. Delivers the video file plus the rebuildable source, following the
   layout in `videos/joey-new-life/`

## Notes

- Default duration 15s, default aspect 4:5 (Instagram feed); reels/shorts
  use 9:16 at 1080x1920
- Never reproduce a real person's likeness from customer photos; graphic
  and typographic elements only unless licensed assets are provided
- Keep total video under 20MB for chat delivery; offer a higher-bitrate
  master on request
