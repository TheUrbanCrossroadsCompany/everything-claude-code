import type { SiteConfig } from '@/lib/site-config';
import metabolichealth from '@/sites/metabolichealth.example/site.config';

/**
 * Adding a new domain:
 *   1. Create /sites/<domain>/site.config.ts + /sites/<domain>/content/*.mdx
 *   2. Register it below (one line). Zero component edits.
 *   3. Build with SITE=<domain> npm run build
 */
export const registry: Record<string, SiteConfig> = {
  'metabolichealth.example': metabolichealth
};
