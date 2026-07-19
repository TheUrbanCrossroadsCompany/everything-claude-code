import type { Metadata } from 'next';
import Link from 'next/link';
import { pillars } from '@/lib/pillars';
import { PillarCard } from '@/components/PillarCard';

export const metadata: Metadata = {
  title: 'The Six Pillars',
  description:
    'Six daily lifestyle pillars for metabolic health: education, food, exercise, stress reduction, forever-chemical avoidance, and clean water.'
};

export default function PillarsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl sm:text-4xl">The six pillars of metabolic health</h1>
        <p className="mt-3 max-w-2xl text-brand-muted">
          A simple daily framework inspired by public conversations in metabolic-health research.
          Educational only — build the habits with your own healthcare team.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map((p) => (
          <PillarCard key={p.id} pillar={p} />
        ))}
      </div>
      <Link
        href="/tracker"
        className="inline-block rounded-brand bg-brand-primary px-8 py-3 font-semibold text-white shadow hover:opacity-90"
      >
        Track all six today →
      </Link>
    </div>
  );
}
