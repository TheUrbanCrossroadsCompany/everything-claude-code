# Key Features Summary — Claude Design bundle

Presentation-ready, self-contained HTML designs prepared for use with Claude Design:
the key features of an end-to-end job matching platform, in three variants.

## Files

- `index.html` — dark theme, 1920×1080 landscape slide (3×3 feature card grid).
- `light.html` — light theme, same 1920×1080 landscape layout and content.
- `portrait.html` — light theme, 1240×1754 (A4-proportion) one-pager with numbered
  feature rows; suited to print, PDF export, and email attachment.

All three are single documents with no JavaScript and no external requests; all styles
are inline CSS and all icons are inline SVG, so they render identically offline, in a
sandboxed importer, or behind a strict CSP.

## Using them with Claude Design

- Attach or paste any of the HTML files into a Claude session with design access and
  iterate on it there, or hand it to any HTML-import pipeline.
- Each document is self-describing for importers: the canvas container is `.slide`
  (declared via the `hz:slide-selector` meta tag) and carries matching
  `data-canvas-width`/`data-canvas-height` attributes (1920×1080 for the landscape
  slides, 1240×1754 for the portrait one-pager).
- Opened directly in a browser, each canvas renders at natural size, centered on a
  neutral backdrop.

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

- Shared structure: header (eyebrow, title, subtitle, 9/9 completion badge), the nine
  feature cards (grid in landscape, numbered rows in portrait), footer with capability
  chips and credit line.
- Tokens live in `:root` at the top of each stylesheet, so themes are a token-block
  swap. Dark palette: deep navy (`#0b1322` → `#090f1c`), electric blue accent
  (`#5b9bff`), success green (`#3ddc97`). Light palette: white → cool gray
  (`#ffffff` → `#f4f7fc`), deeper blue accent (`#2f6bff`), darker success green
  (`#12945f`) for contrast on white. Type is the system UI stack (Inter/SF/Segoe
  first) throughout.
- Each feature is one `<article class="card">` block; edit copy in place or restyle
  globally via the tokens.
