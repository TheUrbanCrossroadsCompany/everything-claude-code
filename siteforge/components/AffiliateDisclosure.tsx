import Link from 'next/link';
import type { SiteConfig } from '@/lib/site-config';

/**
 * FTC affiliate disclosure. Must render above the fold on every page that
 * contains affiliate links.
 */
export function AffiliateDisclosure({ site }: { site: SiteConfig }) {
  if (!site.compliance.affiliateDisclosure) return null;
  return (
    <p className="mb-6 rounded-brand bg-brand-surface px-4 py-2 text-xs text-brand-muted">
      Disclosure: some links on this page are affiliate links. If you buy through them,{' '}
      {site.brandName} may earn a commission at no extra cost to you.{' '}
      <Link href="/disclosure" className="underline">
        Full disclosure
      </Link>
      .
    </p>
  );
}
