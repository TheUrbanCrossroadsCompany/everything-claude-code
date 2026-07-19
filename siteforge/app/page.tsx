import Link from 'next/link';
import { getSite } from '@/lib/get-site';
import { pillars } from '@/lib/pillars';
import { PillarCard } from '@/components/PillarCard';
import { EmailCapture } from '@/components/EmailCapture';
import { getAllArticles } from '@/lib/content';

export default function HomePage() {
  const site = getSite();
  const articles = getAllArticles();
  return (
    <div className="space-y-14">
      <section className="pt-6 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl sm:text-5xl">
          {site.tagline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-muted">{site.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {site.features.tracker ? (
            <Link
              href="/tracker"
              className="rounded-brand bg-brand-primary px-8 py-3 font-semibold text-white shadow hover:opacity-90"
            >
              Start today’s tracker
            </Link>
          ) : null}
          {site.features.pillars ? (
            <Link
              href="/pillars"
              className="rounded-brand border border-brand-primary px-8 py-3 font-semibold text-brand-primary hover:bg-brand-primary/5"
            >
              Learn the six pillars
            </Link>
          ) : null}
        </div>
      </section>

      {site.features.pillars ? (
        <section aria-label="The six pillars">
          <h2 className="text-2xl">The six pillars</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <PillarCard key={p.id} pillar={p} />
            ))}
          </div>
        </section>
      ) : null}

      {articles.length > 0 ? (
        <section aria-label="Latest articles">
          <h2 className="text-2xl">Latest articles</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {articles.slice(0, 4).map((a) => (
              <li
                key={a.frontmatter.slug}
                className="rounded-brand border border-brand-text/10 bg-brand-surface p-5"
              >
                <Link href={`/articles/${a.frontmatter.slug}`} className="font-semibold hover:text-brand-primary">
                  {a.frontmatter.title}
                </Link>
                <p className="mt-2 text-sm text-brand-muted">{a.frontmatter.description}</p>
                <p className="mt-2 text-xs text-brand-muted">{a.readingMinutes} min read</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {site.monetization.primaryCta === 'email' ? <EmailCapture site={site} placement="inline" /> : null}
    </div>
  );
}
