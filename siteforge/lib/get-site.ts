import { registry } from '@/sites/registry';
import type { SiteConfig } from '@/lib/site-config';

/** Returns the config for the domain selected via SITE at build time. */
export function getSite(): SiteConfig {
  const site = process.env.SITE ?? 'metabolichealth.example';
  const config = registry[site];
  if (!config) {
    throw new Error(
      `Unknown SITE "${site}". Registered sites: ${Object.keys(registry).join(', ')}`
    );
  }
  return config;
}
