# UC Assembly Loop

A self-contained HTML animation of The Urban Crossroads Company logo being built,
running as a seamless 15-second loop in real time: the U and C explode into
machined panels, three robotic arms assemble them against a blueprint, and the
finished mark stands on its pedestal under rim light before releasing back into
parts for the next cycle.

## Files

- `index.html` — the whole piece. Canvas 2D plus a small DOM overlay, no
  libraries, no fonts fetched, no external requests. Open it directly in any
  modern browser.

## Timeline

The loop is driven by the wall clock, so it plays at true speed and never
drifts. Every element is a function of loop time `t`, which is what makes the
wrap from 15.00 s back to 0.00 s seamless.

| Loop time | Phase | What happens |
|-----------|-------|--------------|
| 0.0 – 4.5 s | 01 Exploded | Panels hang in a cloud on suspension lines, drifting on periodic motion. |
| 4.5 – 10.5 s | 02 Assembling | Arms slide in; panels fly to the blueprint (U and C interleaved, then the wordmark); sparks and a snap ring on every placement; Align / Build / Connect tick off. |
| 10.5 – 14.0 s | 03 Complete | Rim glow, light rays, skyline and pedestal brighten; slow camera push. |
| 14.0 – 15.0 s | Release | A pulse ring fires and the parts blow back to their exploded positions, landing exactly where the loop starts. |

## Controls

- Click the stage or press `Space` to pause and resume.
- Press `1`, `2` or `3` to jump to the start of a phase; `R` restarts the loop.
- Deep link into a moment with a hash: `index.html#t=12` opens at 12.0 s and
  `index.html#t=7.5&pause` holds that frame, which is handy for review screenshots.
- With `prefers-reduced-motion` enabled the page opens paused on the completed logo.

## Design notes

- Geometry lives in a 1000 × 1320 design box that is scaled to fit the viewport.
  The U is 280 wide by 480 tall and the C has a 570 outer diameter; those are the
  three dimension lines shown during assembly.
- Each panel is pre-rendered once as a sprite (brushed-steel gradient, extruded
  side faces, gold inner trim and one of four inset details: window bands, a lit
  grid, a gold plate or a planted terrace), so the per-frame cost is a transform
  and a `drawImage`.
- The arms use analytic two-bone inverse kinematics and follow the part that is
  closest to snapping into place in their region.
- Palette: charcoal ground `#0b0d11` / `#171b23`, steel `#5a616b` → `#e9ecf0`,
  gold accent `#f0b860` / `#ffd991`, blueprint blue `#7fb6ff` (assembly phase only).
- Timing constants (`T1`, `T2`, `T3`, `DUR`, `LOOP`) sit at the top of the script
  if you want a different cadence.
