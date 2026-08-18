# Key Features Summary — Claude Design bundle

A presentation-ready, self-contained HTML design prepared for use with Claude Design:
a single 1920×1080 slide summarizing the key features of an end-to-end job matching
platform.

## Files

- `index.html` — the complete design. One slide, no JavaScript, no external requests;
  all styles are inline CSS and all icons are inline SVG, so it renders identically
  offline, in a sandboxed importer, or behind a strict CSP.

## Using it with Claude Design

- Attach or paste `index.html` into a Claude session with design access and iterate on
  it there, or hand it to any HTML-import pipeline.
- The document is self-describing for importers: the slide container is `.slide`
  (declared via the `hz:slide-selector` meta tag) and carries
  `data-canvas-width="1920" data-canvas-height="1080"`.
- Opened directly in a browser, the slide renders at natural size, centered on a dark
  backdrop.

## Content

Source content, reproduced verbatim from the request:

| Feature | Detail |
|---------|--------|
| Complete Authentication | Multi-provider OAuth with enterprise support |
| AI Resume Parsing | OpenAI-powered document processing |
| 4-Source Job Aggregation | Indeed, LinkedIn, Glassdoor, ZipRecruiter |
| Advanced Search | 20+ filtering criteria with saved searches |
| Application Tracking | Complete lifecycle management |
| Analytics Dashboard | Progress tracking with visualizations |
| Email Notifications | Automated alerts and summaries |
| Database Persistence | PostgreSQL with comprehensive schema |
| Enterprise Ready | Scalable architecture with proper error handling |

Closing statement: "This platform provides a complete end-to-end job matching solution
with enterprise-grade features, AI-powered matching, and comprehensive user management
capabilities."

## Exporting to PNG / JPEG / PDF

`scripts/export-graphic.mjs` renders any self-contained HTML graphic in this repo to a
flat image or a one-page PDF, cropped to the design itself rather than the browser
window. It needs Playwright, which is not a dependency of this repo:

```bash
npm i -D playwright && npx playwright install chromium
```

Then, from the repo root:

```bash
# 3840x2160 PNG (1920 CSS px at 2x) into ./exports
npm run design:export -- designs/key-features-summary/index.html --width 1920

# all three formats at once
npm run design:export -- designs/key-features-summary/index.html \
  --width 1920 --formats png,jpeg,pdf
```

The script auto-detects the crop target — `.canvas`, `.slide`, `[data-canvas-width]`,
`[data-graphic-root]`, then `body` — so this design exports at exactly 1920x1080 CSS px
with no surrounding page background. Pass `--selector` to override it.

Useful flags: `--scale` (device pixel ratio, default 2), `--quality` (JPEG, default 92),
`--settle` (ms to wait for load animations, default 2600), `--scheme light|dark`,
`--out` (default `./exports`, git-ignored), and `--no-freeze` to capture animations
mid-flight instead of pausing them. Run with `--help` for the full list.

Note that `--width` sets the viewport, not the output size. A fixed-canvas design like
this one renders at its declared 1920x1080 regardless; use `--scale` to change the
exported resolution. `--width` matters for responsive graphics, where a comma-separated
list (`--width 1600,1080,800`) emits one file per breakpoint, suffixed `-1600w` and so on.

## Design notes

- Layout: header (eyebrow, title, subtitle, 9/9 completion badge), 3×3 feature card
  grid, footer with capability chips and credit line.
- Tokens live in `:root` at the top of the stylesheet — palette is deep navy
  (`#0b1322` → `#090f1c`) with electric blue accent (`#5b9bff`) and success green
  (`#3ddc97`); type is the system UI stack (Inter/SF/Segoe first).
- Each feature is one `<article class="card">` block; edit copy in place or restyle
  globally via the tokens.
