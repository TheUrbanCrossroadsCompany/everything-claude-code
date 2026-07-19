import type { SiteConfig } from '@/lib/site-config';

/**
 * Tracked outbound affiliate CTA. Appends the program tracking param plus a
 * subid (article slug) so revenue attributes per article.
 */
export function AffiliateCTA({
  site,
  href,
  label,
  subid,
  programId
}: {
  site: SiteConfig;
  href: string;
  label: string;
  subid: string;
  programId?: string;
}) {
  const program =
    site.monetization.affiliatePrograms.find((p) => p.id === programId) ??
    site.monetization.affiliatePrograms[0];
  const sep = href.includes('?') ? '&' : '?';
  const tracking = program?.trackingParam ? `${sep}${program.trackingParam}&subid=${subid}` : `${sep}subid=${subid}`;
  return (
    <a
      href={`${href}${tracking}`}
      target="_blank"
      rel="nofollow sponsored noopener"
      data-affiliate="true"
      data-subid={subid}
      className="inline-block rounded-brand bg-brand-accent px-6 py-3 font-semibold text-white shadow hover:opacity-90"
    >
      {label} →
    </a>
  );
}
