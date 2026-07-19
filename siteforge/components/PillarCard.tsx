import type { Pillar } from '@/lib/pillars';

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="rounded-brand border border-brand-text/10 border-t-2 border-t-brand-primary bg-brand-surface p-6">
      <div className="flex items-start gap-4">
        <p
          aria-hidden="true"
          className="font-heading text-4xl font-extrabold leading-none text-brand-primary"
        >
          {pillar.number}
        </p>
        <div>
          <h3 className="text-lg leading-tight">
            <span aria-hidden="true" className="mr-2">
              {pillar.emoji}
            </span>
            {pillar.title}
          </h3>
        </div>
      </div>
      <p className="mt-4 text-sm text-brand-muted">{pillar.summary}</p>
      <p className="mt-4 border-l-2 border-brand-primary pl-3 text-sm font-medium">
        Daily habit: {pillar.dailyHabit}
      </p>
    </article>
  );
}
