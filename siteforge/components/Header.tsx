import Link from 'next/link';
import type { SiteConfig } from '@/lib/site-config';

export function Header({ site }: { site: SiteConfig }) {
  return (
    <header className="border-b border-brand-text/10 bg-brand-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="font-heading text-xl font-extrabold text-brand-primary">
          {site.brandName}
        </Link>
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-4 text-sm font-medium">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-brand px-2 py-1 text-brand-text hover:text-brand-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
