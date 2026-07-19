import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'All articles.'
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl">Articles</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <li
            key={a.frontmatter.slug}
            className="rounded-brand border border-brand-text/10 bg-brand-surface p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
              {a.frontmatter.category}
            </p>
            <Link
              href={`/articles/${a.frontmatter.slug}`}
              className="mt-1 block font-semibold hover:text-brand-primary"
            >
              {a.frontmatter.title}
            </Link>
            <p className="mt-2 text-sm text-brand-muted">{a.frontmatter.description}</p>
            <p className="mt-2 text-xs text-brand-muted">
              {a.frontmatter.date} · {a.readingMinutes} min read
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
