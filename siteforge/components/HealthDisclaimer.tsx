import type { SiteConfig } from '@/lib/site-config';

/**
 * Informational-only banner rendered site-wide on health/wellness niches.
 * Hard compliance requirement — do not remove or gate behind interaction.
 */
export function HealthDisclaimer({ site }: { site: SiteConfig }) {
  if (!site.compliance.healthDisclaimer) return null;
  return (
    <div
      role="note"
      className="border-b border-brand-primary/20 bg-brand-primary/10 px-4 py-2 text-center text-xs text-brand-text"
    >
      Educational content only — not medical advice. Talk to your doctor before making health
      changes.
    </div>
  );
}
