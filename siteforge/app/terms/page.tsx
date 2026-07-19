import type { Metadata } from 'next';
import { getSite } from '@/lib/get-site';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  const site = getSite();
  return (
    <div className="prose-site mx-auto max-w-3xl">
      <h1 className="text-3xl">Terms of Use</h1>
      <p>
        By using {site.domain}, operated by {site.compliance.legalEntity}, you agree to these
        terms.
      </p>
      <h2>Educational content only</h2>
      <p>
        All content on this site is provided for general education and entertainment. It is not
        medical, legal, or financial advice. Nothing here diagnoses, treats, cures, or prevents
        any disease. Always consult qualified professionals — including your physician — before
        acting on anything you read here.
      </p>
      <h2>No warranties</h2>
      <p>
        The site is provided &quot;as is&quot; without warranties of any kind. We are not liable
        for decisions you make based on this content.
      </p>
      <h2>Affiliate relationships</h2>
      <p>
        Some links are affiliate links; see our <a href="/disclosure">disclosure</a>.
      </p>
      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.compliance.contactEmail}`}>{site.compliance.contactEmail}</a>
      </p>
    </div>
  );
}
