import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllArticles, getArticle } from '@/lib/content';
import { getSite } from '@/lib/get-site';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { EmailCapture } from '@/components/EmailCapture';
import { AffiliateCTA } from '@/components/AffiliateCTA';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.frontmatter.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/articles/${article.frontmatter.slug}` }
  };
}

export default function ArticlePage({ params }: Props) {
  const site = getSite();
  const article = getArticle(params.slug);
  if (!article) notFound();

  const { frontmatter, body, readingMinutes } = article;
  const hasAffiliateLinks = frontmatter.affiliateLinks.length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': frontmatter.schemaType,
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    author: { '@type': 'Organization', name: site.author.name },
    publisher: { '@type': 'Organization', name: site.compliance.legalEntity }
  };

  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          {frontmatter.category}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{frontmatter.title}</h1>
        <p className="mt-3 text-brand-muted">{frontmatter.description}</p>
        <p className="mt-2 text-xs text-brand-muted">
          {frontmatter.date} · {readingMinutes} min read
        </p>
      </header>

      {hasAffiliateLinks ? <AffiliateDisclosure site={site} /> : null}

      <div className="prose-site">
        <MDXRemote
          source={body}
          components={{
            AffiliateCTA: (props: { href: string; label: string }) => (
              <AffiliateCTA site={site} subid={frontmatter.slug} {...props} />
            )
          }}
        />
      </div>

      <div className="mt-12">
        <EmailCapture site={site} placement="inline" />
      </div>

      <aside className="mt-10 rounded-brand border border-brand-text/10 bg-brand-surface p-5">
        <p className="text-sm font-semibold">{site.author.name}</p>
        <p className="mt-1 text-sm text-brand-muted">{site.author.bio}</p>
      </aside>
    </article>
  );
}
