'use client';

import { useEffect, useMemo, useState } from 'react';
import { pillars } from '@/lib/pillars';
import { computeGki, gkiZone, gradeForScore, scoreDay, type DayEntry } from '@/lib/tracking';

const STORAGE_KEY = 'siteforge-daily-tracker-v1';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyEntry(date: string): DayEntry {
  return { date, pillars: {}, waterGlasses: 0, glucoseMgDl: null, ketonesMmol: null };
}

function loadAll(): Record<string, DayEntry> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DayEntry>) : {};
  } catch {
    return {};
  }
}

export function DailyTracker() {
  const [entries, setEntries] = useState<Record<string, DayEntry>>({});
  const [loaded, setLoaded] = useState(false);
  const date = todayKey();
  const entry = entries[date] ?? emptyEntry(date);

  useEffect(() => {
    setEntries(loadAll());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries, loaded]);

  function update(patch: Partial<DayEntry>) {
    setEntries((prev) => ({ ...prev, [date]: { ...(prev[date] ?? emptyEntry(date)), ...patch } }));
  }

  const score = scoreDay(entry);
  const grade = gradeForScore(score);
  const gki = computeGki(entry.glucoseMgDl, entry.ketonesMmol);

  const streak = useMemo(() => {
    let count = 0;
    const day = new Date();
    for (;;) {
      const key = day.toISOString().slice(0, 10);
      const e = entries[key];
      if (e && scoreDay(e) >= 60) count += 1;
      else if (key !== date) break;
      day.setDate(day.getDate() - 1);
      if (count > 365) break;
    }
    return count;
  }, [entries, date]);

  if (!loaded) {
    return <p className="text-sm text-brand-muted">Loading your tracker…</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section aria-label="Today's habits" className="space-y-3">
        <h2 className="text-xl">Today’s six pillars — {date}</h2>
        {pillars.map((p) => {
          const checked = p.id === 'water' ? entry.waterGlasses >= 8 : Boolean(entry.pillars[p.id]);
          return (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-brand border border-brand-text/10 bg-brand-surface p-4"
            >
              <label className="flex items-center gap-3 text-sm font-medium">
                {p.id !== 'water' ? (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      update({ pillars: { ...entry.pillars, [p.id]: e.target.checked } })
                    }
                    className="h-5 w-5 accent-[rgb(var(--color-primary))]"
                  />
                ) : (
                  <span aria-hidden="true">{checked ? '✅' : '⬜'}</span>
                )}
                <span>
                  <span aria-hidden="true" className="mr-1">
                    {p.emoji}
                  </span>
                  {p.dailyHabit}
                </span>
              </label>
              {p.id === 'water' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Remove a glass of water"
                    onClick={() => update({ waterGlasses: Math.max(0, entry.waterGlasses - 1) })}
                    className="h-8 w-8 rounded-full bg-brand-primary/10 font-bold text-brand-primary"
                  >
                    −
                  </button>
                  <span className="w-14 text-center text-sm font-semibold">
                    {entry.waterGlasses}/8
                  </span>
                  <button
                    type="button"
                    aria-label="Add a glass of water"
                    onClick={() => update({ waterGlasses: Math.min(20, entry.waterGlasses + 1) })}
                    className="h-8 w-8 rounded-full bg-brand-primary/10 font-bold text-brand-primary"
                  >
                    +
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        <div className="rounded-brand border border-brand-text/10 bg-brand-surface p-4">
          <h3 className="text-base">Glucose &amp; ketone log (optional, informational)</h3>
          <p className="mt-1 text-xs text-brand-muted">
            If you already measure with your own meter, log values to see your Glucose-Ketone
            Index (GKI) — an informational ratio, not a diagnosis or treatment target.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="text-sm">
              Glucose (mg/dL)
              <input
                type="number"
                min={0}
                max={500}
                value={entry.glucoseMgDl ?? ''}
                onChange={(e) =>
                  update({ glucoseMgDl: e.target.value === '' ? null : Number(e.target.value) })
                }
                className="mt-1 block w-32 rounded-brand border border-brand-text/20 bg-brand-bg px-3 py-2 text-brand-text"
              />
            </label>
            <label className="text-sm">
              Ketones (mmol/L)
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={entry.ketonesMmol ?? ''}
                onChange={(e) =>
                  update({ ketonesMmol: e.target.value === '' ? null : Number(e.target.value) })
                }
                className="mt-1 block w-32 rounded-brand border border-brand-text/20 bg-brand-bg px-3 py-2 text-brand-text"
              />
            </label>
          </div>
          {gki !== null ? (
            <p className="mt-3 rounded-brand bg-brand-primary/10 px-3 py-2 text-sm">
              GKI today: <strong>{gki.toFixed(1)}</strong> — {gkiZone(gki)}
            </p>
          ) : null}
        </div>
      </section>

      <aside aria-label="Your grade" className="space-y-4">
        <div className="rounded-brand border border-brand-text/10 bg-brand-surface p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
            Today’s grade
          </p>
          <p className="mt-2 font-heading text-7xl font-extrabold text-brand-primary">{grade}</p>
          <p className="mt-1 text-sm text-brand-muted">{score}% of daily habits</p>
          <div
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-4 h-3 w-full overflow-hidden rounded-full bg-brand-text/10"
          >
            <div className="h-full bg-brand-accent" style={{ width: `${score}%` }} />
          </div>
        </div>
        <div className="rounded-brand border border-brand-text/10 bg-brand-surface p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">Streak</p>
          <p className="mt-2 text-4xl font-extrabold">
            🔥 {streak} {streak === 1 ? 'day' : 'days'}
          </p>
          <p className="mt-1 text-xs text-brand-muted">Days scoring 60% or better</p>
        </div>
        <p className="text-xs text-brand-muted">
          Data stays in your browser (localStorage). Nothing is uploaded anywhere.
        </p>
      </aside>
    </div>
  );
}
