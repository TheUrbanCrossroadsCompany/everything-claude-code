import { z } from 'zod';

/**
 * SiteForge config schema.
 *
 * Everything unique to a domain lives in /sites/<domain>/site.config.ts and
 * must satisfy this schema. Components read ONLY from this config plus theme
 * tokens — never hardcode brand values.
 *
 * All external service IDs are placeholders documented in README.md. No real
 * secrets belong in these files.
 */

export const themeTokensSchema = z.object({
  /** RGB triplets ("13 148 136") so Tailwind alpha values compose. */
  primary: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  accent: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  bg: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  surface: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  text: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  muted: z.string().regex(/^\d{1,3} \d{1,3} \d{1,3}$/),
  headingFont: z.string().default('system-ui'),
  bodyFont: z.string().default('system-ui'),
  radius: z.string().default('0.75rem'),
  /** Manifesto-style condensed uppercase headings (e.g. dark editorial themes). */
  headingUppercase: z.boolean().default(false)
});

export const navItemSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const affiliateProgramSchema = z.object({
  id: z.string(),
  name: z.string(),
  network: z.enum(['amazon', 'shareasale', 'impact', 'cj', 'direct', 'other']),
  /** Appended to outbound links for attribution, e.g. "?tag=PLACEHOLDER-20". */
  trackingParam: z.string().optional()
});

export const monetizationSchema = z.object({
  /** Exactly one primary CTA per page; secondary streams are support blocks. */
  primaryCta: z.enum(['affiliate', 'lead', 'email']),
  affiliatePrograms: z.array(affiliateProgramSchema).default([]),
  /** Kit (ConvertKit) form ID placeholder, e.g. "KIT_FORM_ID_PLACEHOLDER". */
  emailFormId: z.string().optional(),
  leadMagnetTitle: z.string().optional(),
  /** Webhook URL env var NAME (never the URL itself), e.g. "NEXT_PUBLIC_LEAD_WEBHOOK_URL". */
  leadWebhookEnvVar: z.string().optional(),
  /** Dubsado (or similar) booking link for services CTA. */
  bookingUrl: z.string().url().optional(),
  adsEnabled: z.boolean().default(false),
  sponsorsEnabled: z.boolean().default(false)
});

export const complianceSchema = z.object({
  /** Renders FTC affiliate disclosure above the fold on affiliate pages. */
  affiliateDisclosure: z.boolean().default(true),
  /** Health/wellness informational-only disclaimer, site-wide. */
  healthDisclaimer: z.boolean().default(false),
  /** Crypto "not financial advice" banner, site-wide. */
  cryptoDisclaimer: z.boolean().default(false),
  /** Legal entity used in privacy/terms/disclosure pages. */
  legalEntity: z.string(),
  contactEmail: z.string().email()
});

export const analyticsSchema = z.object({
  provider: z.enum(['ga4', 'plausible', 'none']).default('none'),
  /** Measurement ID / domain placeholder, e.g. "G-PLACEHOLDER". */
  id: z.string().optional()
});

export const authorSchema = z.object({
  name: z.string(),
  bio: z.string(),
  avatar: z.string().optional()
});

export const siteConfigSchema = z.object({
  domain: z.string(),
  brandName: z.string(),
  tagline: z.string(),
  niche: z.enum(['health-education', 'tech-affiliate', 'solar-leadgen', 'crypto-education', 'general']),
  description: z.string(),
  /** Small kicker line rendered above the hero headline (editorial style). */
  heroEyebrow: z.string().optional(),
  logoPath: z.string().optional(),
  theme: themeTokensSchema,
  nav: z.array(navItemSchema),
  footerNav: z.array(navItemSchema),
  monetization: monetizationSchema,
  compliance: complianceSchema,
  analytics: analyticsSchema,
  author: authorSchema,
  /** Feature routes toggled per site. */
  features: z
    .object({
      tracker: z.boolean().default(false),
      pillars: z.boolean().default(false)
    })
    .default({})
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type ThemeTokens = z.infer<typeof themeTokensSchema>;

/** Validates at module load so a bad config fails the build, not production. */
export function defineSiteConfig(config: unknown): SiteConfig {
  return siteConfigSchema.parse(config);
}
