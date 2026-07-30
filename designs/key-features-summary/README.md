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

## Design notes

- Layout: header (eyebrow, title, subtitle, 9/9 completion badge), 3×3 feature card
  grid, footer with capability chips and credit line.
- Tokens live in `:root` at the top of the stylesheet — palette is deep navy
  (`#0b1322` → `#090f1c`) with electric blue accent (`#5b9bff`) and success green
  (`#3ddc97`); type is the system UI stack (Inter/SF/Segoe first).
- Each feature is one `<article class="card">` block; edit copy in place or restyle
  globally via the tokens.
