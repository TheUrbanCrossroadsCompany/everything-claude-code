import type { Metadata } from 'next';
import { getSite } from '@/lib/get-site';

export const metadata: Metadata = { title: 'Affiliate Disclosure' };

export default function DisclosurePage() {
  const site = getSite();
  return (
    <div className="prose-site mx-auto max-w-3xl">
      <h1 className="text-3xl">Affiliate Disclosure</h1>
      <p>
        {site.domain} is operated by {site.compliance.legalEntity}. Some links on this site are
        affiliate links, which means we may earn a commission if you click through and make a
        purchase — at no additional cost to you.
      </p>
      <p>
        We participate in affiliate programs including{' '}
        {site.monetization.affiliatePrograms.map((p) => p.name).join(', ') || 'none currently'}.
        As an Amazon Associate, we earn from qualifying purchases where applicable.
      </p>
      <p>
        Our recommendations reflect our honest research and opinions. Affiliate relationships
        never change the price you pay and never override our editorial judgment.
      </p>
      <p>
        Questions: <a href={`mailto:${site.compliance.contactEmail}`}>{site.compliance.contactEmail}</a>
      </p>
    </div>
  );
}
