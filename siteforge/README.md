# SiteForge

One codebase → many independent, deployable niche websites for The Urban Crossroads
Company. Each domain gets its own brand, content, and revenue streams from a single
config folder. Static generation everywhere; no database.

## ⚠️ TO DO before building any page: design research first

We do not ship cookie-cutter layouts. Every new site/page starts from designs
proven by companies that already spent the development budget:

1. **Connect the Mobbin MCP server** (already cataloged in
   `../mcp-configs/mcp-servers.json`):
   `claude mcp add mobbin --scope user --transport http https://api.mobbin.com/mcp`
   — OAuth prompt on first use. Requires an interactive session with network
   access to `api.mobbin.com` (remote/CI sandboxes typically block it; do the
   research step from a local interactive session).
2. **Research the niche's proven apps on Mobbin** (e.g. health tracking:
   Whoop, Oura, Levels; solar/lead-gen: service marketplaces; crypto:
   exchanges/education apps). Capture: base palette, the ONE accent color,
   type scale, layout of the money screens (dashboard, article, capture).
3. **Encode the findings as theme tokens** in `sites/<domain>/site.config.ts`
   (colors, fonts, radius, `headingUppercase`, `heroEyebrow`). Components must
   stay generic — research results live in config, never hardcoded in
   components.
4. Fallback when Mobbin is unavailable: teardown articles + official design
   blogs of the same reference apps via web search, then step 3 as usual.

Current demo-site theme provenance: the six-pillar manifesto artwork
(black/cream/red editorial) merged with dark-tracker patterns documented for
Whoop/Oura (near-black `#0B0B0F` base, single high-energy accent reserved for
progress + CTAs, oversized numeric stats).

## Quick start

```bash
cd siteforge
npm install
SITE=metabolichealth.example npm run dev     # develop one site
SITE=metabolichealth.example npm run build   # build one site
npm run lint
npm run typecheck
```

`SITE` selects which domain config is baked into the build. Default:
`metabolichealth.example` (the demo site).

## Adding a new domain (target: under 10 minutes)

1. Copy `sites/metabolichealth.example/` to `sites/<your-domain>/`.
2. Edit `site.config.ts` — brand, tokens, nav, monetization toggles, compliance,
   analytics. The config is zod-validated; a bad config fails the build.
3. Drop MDX articles into `sites/<your-domain>/content/`.
4. Register the config in `sites/registry.ts` (one line).
5. `SITE=<your-domain> npm run build`.

Zero component edits required. Hardcoded brand values in components are a defect —
everything reads from config + theme tokens.

## Environment variables (placeholders only — never commit real values)

| Variable | Purpose |
|---|---|
| `SITE` | Domain config to build (build-time) |
| `NEXT_PUBLIC_LEAD_WEBHOOK_URL` | Lead form POST target (lead-gen sites) |

Service IDs that live in site configs are placeholders by convention:
`KIT_FORM_ID_PLACEHOLDER`, `AMAZON_ASSOC_TAG_PLACEHOLDER`, `PLAUSIBLE_DOMAIN_PLACEHOLDER`,
`G-PLACEHOLDER`. Replace them per-site at deploy time via your host's env/config — never
in source control.

## Deploy (instructions only — this repo never deploys)

**Vercel:** create one project per domain, root directory `siteforge/`, build command
`SITE=<domain> next build`, then attach the domain.
**Cloudflare Pages:** same pattern with `SITE` set in the project's build environment.

## Compliance posture (hard requirements)

- Health/wellness sites (`healthDisclaimer: true`): informational-only banner site-wide,
  disclaimer in footer and terms. No content may claim to diagnose, treat, cure, or
  prevent any disease.
- FTC affiliate disclosure renders above the fold on any page with affiliate links, plus
  a full `/disclosure` page.
- `/privacy` and `/terms` generate from config (legal entity + contact).
- Crypto sites (`cryptoDisclaimer: true`): "not financial advice" banner; no yield or
  return claims in template copy.
- Tracker data (habits, glucose/ketones) is localStorage-only. No health data ever
  touches a server.

## Architecture

- `lib/site-config.ts` — zod schema; `defineSiteConfig()` validates at build.
- `sites/<domain>/site.config.ts` — everything unique to a domain.
- `sites/registry.ts` — SITE → config map.
- `lib/theme.ts` + `components/ThemeStyle.tsx` — tokens → CSS custom properties →
  Tailwind `brand-*` classes.
- `lib/content.ts` — MDX + frontmatter (zod-validated) from the active site's folder.
- `lib/tracking.ts` — pure grading/GKI functions (unit-testable).
- `components/` — shared, token-driven library (monetization, compliance, tracker).
