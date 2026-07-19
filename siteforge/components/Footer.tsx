import Link from 'next/link';
import type { SiteConfig } from '@/lib/site-config';
import { EmailCapture } from '@/components/EmailCapture';

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="mt-16 border-t border-brand-text/10 bg-brand-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {site.monetization.emailFormId ? (
          <div className="mb-8">
            <EmailCapture site={site} placement="footer" />
          </div>
        ) : null}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-4 text-sm">
            {site.footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-brand-muted hover:text-brand-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-xs text-brand-muted">
          © {new Date().getFullYear()} {site.compliance.legalEntity}. All rights reserved.
        </p>
        {site.compliance.healthDisclaimer ? (
          <p className="mt-2 max-w-3xl text-xs text-brand-muted">
            {site.brandName} publishes educational information only. Nothing on this site is
            medical advice, and nothing here diagnoses, treats, cures, or prevents any disease.
            Always consult a qualified healthcare professional before changing your diet,
            exercise, or health routine.
          </p>
        ) : null}
      </div>
    </footer>
  );
}
