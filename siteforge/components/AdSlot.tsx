import type { SiteConfig } from '@/lib/site-config';

/**
 * Labeled, fixed-height ad placeholder so display ads can be enabled later
 * without layout shift. Renders nothing unless ads are enabled in config.
 */
export function AdSlot({
  site,
  position
}: {
  site: SiteConfig;
  position: 'header' | 'in-content' | 'footer';
}) {
  if (!site.monetization.adsEnabled) return null;
  return (
    <div
      aria-label="Advertisement"
      data-ad-position={position}
      className="my-6 flex h-24 items-center justify-center rounded-brand border border-dashed border-brand-text/20 text-xs uppercase tracking-wide text-brand-muted"
    >
      Advertisement
    </div>
  );
}
