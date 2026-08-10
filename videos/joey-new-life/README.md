# Joey "New Life" Animated Video

A 15-second animated motivational video (1080x1350, 30fps, H.264 + AAC) generated
from the "The Moment You Decide You Deserve Better" poster design. Kinetic
typography over an animated lighthouse seascape, with fully synthesized sound
effects.

## Files

- `joey-new-life-15s.mp4` — final rendered video with sound
- `poster.html` — the animation itself; exposes `window.seek(t)` for
  deterministic frame-by-frame rendering
- `render-frames.js` — captures 450 JPEG frames via Playwright + Chromium
- `make-sfx.js` — synthesizes the SFX track (ocean ambience, impact booms,
  whooshes, ticks, riser, shimmer chime) as a stereo WAV, no samples needed

## Timeline

| Time | Scene | Sound |
|------|-------|-------|
| 0.0–3.4s | "THE MOMENT / YOU DECIDE / YOU DESERVE / BETTER," word punches | wave crash + impact boom per word |
| 3.4–6.0s | "EVERYTHING BEGINS TO **SHIFT.**" slam | whoosh, big boom, spray |
| 6.0–8.6s | Quote box: "You don't need a perfect plan..." | whoosh, box-land tick |
| 8.6–11.7s | 5 steps slide in (clarify, first step, discipline, push, wake up) | tick per step |
| 11.7–15s | "NEW ENERGY. NEW HABITS. NEW RESULTS. **NEW LIFE.**" + script closer | riser, boom, shimmer chime, fade out |

## Rebuilding

```bash
npm install playwright-core ffmpeg-static
node make-sfx.js
node render-frames.js
ffmpeg -framerate 30 -i frames/f%04d.jpg -i sfx.wav \
  -c:v libx264 -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart joey-new-life-15s.mp4
```

`render-frames.js` expects a Playwright Chromium at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; point `executablePath`
at any local Chromium/Chrome build to run elsewhere.
