import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/** MDX frontmatter contract for all article templates. */
export const frontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  primaryKeyword: z.string().optional(),
  affiliateLinks: z.array(z.string()).default([]),
  ctaType: z.enum(['affiliate', 'lead', 'email']).default('email'),
  schemaType: z.enum(['Article', 'Review', 'FAQ']).default('Article'),
  template: z.enum(['roundup', 'review', 'howto', 'comparison']).default('howto')
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface Article {
  frontmatter: Frontmatter;
  body: string;
  readingMinutes: number;
}

function contentDir(): string {
  const site = process.env.SITE ?? 'metabolichealth.example';
  return path.join(process.cwd(), 'sites', site, 'content');
}

/** Minimal frontmatter parser (--- delimited, flat YAML subset + string arrays). */
function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match || match[1] === undefined || match[2] === undefined) {
    return { data: {}, body: raw };
  }
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z][\w]*):\s*(.*)$/.exec(line);
    if (!kv || kv[1] === undefined || kv[2] === undefined) continue;
    const key = kv[1];
    const value = kv[2].trim();
    if (value.startsWith('[')) {
      data[key] = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return { data, body: match[2] };
}

export function getAllArticles(): Article[] {
  const dir = contentDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, body } = parseFrontmatter(raw);
      const frontmatter = frontmatterSchema.parse(data);
      const words = body.split(/\s+/).filter(Boolean).length;
      return {
        frontmatter,
        body,
        readingMinutes: Math.max(1, Math.round(words / 220))
      };
    })
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.frontmatter.slug === slug);
}
