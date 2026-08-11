# Animation Styles Arsenal

Catalog of animation styles the studio can produce with the HTML/canvas +
Playwright + ffmpeg pipeline (see `videos/joey-new-life/` for the reference
implementation), plus the brand-fit rules for recommending a style from a
customer's logo and website.

## When to Use

- A customer asks for an animated video, promo, intro, or social clip
- You need to recommend an animation style based on a customer's brand
  (logo, website, colors, typography, audience)
- You are storyboarding or rendering a video and need implementation
  recipes for a specific style

## How It Works

Every style below is produced the same way: a deterministic HTML/canvas
animation exposing `window.seek(t)`, rendered frame-by-frame in headless
Chromium, encoded with ffmpeg, with synthesized or licensed audio muxed in.
The style changes the *drawing and easing recipes*, not the pipeline.

### Style catalog

| Style | Look | Best for | Recipe highlights |
|-------|------|----------|-------------------|
| Kinetic typography | Words punch, slide, scale in sync with audio | Quote/motivational content, podcasts, lyric clips | Back-out easing, per-word timeline, camera shake on impacts |
| Motion graphics (flat 2D) | Geometric shapes, charts, icons gliding with purpose | SaaS, fintech, explainers, corporate | Shape choreography, staggered ease-in-out, flat color + subtle shadow |
| 2.5D parallax | Layered flat art sliding at different speeds for depth | Real estate, travel, storytelling brands | 3–5 depth layers, translate at layer-speed ratios, slow zoom |
| Liquid motion | Blobs, waves, ink-like morphs between scenes | Beauty, wellness, creative agencies, music | Canvas metaballs or SVG filter turbulence, morphing masks as transitions |
| Glitch / digital | RGB split, scanlines, datamosh stutters | Gaming, tech, streetwear, music drops | Slice offsets on random frames, chromatic aberration, steps() timing |
| Isometric | 30-degree 3D-ish world built from cubes and slabs | Logistics, construction, dev tools, smart-city | Iso projection math on canvas, build-up reveals block by block |
| Whiteboard / line draw | Hand-drawn strokes appearing progressively | Education, consulting, nonprofits, how-to | SVG stroke-dashoffset reveals, pencil SFX, paper texture ground |
| Stop-motion / cutout | Choppy, handmade, 8–12 fps charm | Food, kids, crafts, indie brands | Render at 30fps but hold poses (steps timing), wiggle positions ±2px |
| Pixel / 8-bit | Retro game sprites and chunky type | Gaming, nostalgia campaigns, arcade promos | Low-res canvas upscaled with image-rendering: pixelated, chiptune SFX |
| Anime-inspired | Speed lines, dramatic holds, impact frames | Fitness, sports, hype reels, product drops | Radial speed lines, smash zooms, 2-frame impact flashes |
| 3D-feel (CSS/canvas) | Rotating cards, extruded logos, lighting sweeps | Automotive, hardware, luxury, awards | CSS 3D transforms or canvas shading, specular gradient sweeps |
| Particle / logo reveal | Thousands of dots converge into the logo or text | Launches, anniversaries, premium intros | Particle sim seeking target pixel positions sampled from the logo |

### Brand-fit recommendation rules

Read the customer's **logo**:

- **Shape language**: geometric/angular → motion graphics, isometric,
  glitch; rounded/organic → liquid motion, 2.5D parallax; hand-drawn or
  script → whiteboard, stop-motion
- **Palette**: monochrome/2-color → flat motion graphics or kinetic type;
  gradients → liquid motion or 3D-feel; neon on dark → glitch or anime
- **Mascot or character present** → character-led 2D or stop-motion
- **Wordmark-only logo** → kinetic typography or particle logo reveal

Read the customer's **website**:

- **Tone of copy**: authoritative → motion graphics; inspirational →
  kinetic typography; playful → stop-motion/cutout or pixel
- **Existing motion**: mirror the site's easing and pace so the video
  feels native to the brand
- **Audience age/energy**: younger + hype → anime-inspired or glitch;
  professional buyers → motion graphics or 3D-feel
- **Photography-heavy site** → 2.5D parallax using their own imagery

Always present a primary recommendation plus one alternate, each with a
one-line rationale tied to a concrete observation about the logo or site.

### Sound design pairing

| Style | SFX palette |
|-------|-------------|
| Kinetic type / anime | Impact booms, whooshes, risers |
| Motion graphics | Soft ticks, pops, subtle synth pads |
| Liquid motion | Water drops, smooth sweeps, chimes |
| Glitch / pixel | Bitcrush stutters, chiptune blips |
| Whiteboard | Pencil scratches, page turns |
| Stop-motion | Foley clicks, tape, cardboard thumps |

## Examples

- "Make a promo for this gym's logo" → angular wordmark + neon palette +
  young audience → anime-inspired with impact frames; alternate: glitch
- "Animate our law firm's quote" → serif wordmark, navy site, formal
  copy → kinetic typography with restrained easing; alternate: motion
  graphics
- Reference build: `videos/joey-new-life/` (kinetic typography +
  synthesized SFX, 15s, 30fps)
