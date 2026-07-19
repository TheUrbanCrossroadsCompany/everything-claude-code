import type { Pillar } from '@/lib/pillars';

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="rounded-brand border border-brand-text/10 bg-brand-surface p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="text-3xl">
          {pillar.emoji}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">
            {pillar.number}
          </p>
          <h3 className="text-lg">{pillar.title}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-brand-muted">{pillar.summary}</p>
      <p className="mt-3 rounded-brand bg-brand-primary/10 px-3 py-2 text-sm font-medium">
        Daily habit: {pillar.dailyHabit}
      </p>
    </article>
  );
}
