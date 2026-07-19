import type { Metadata } from 'next';
import { DailyTracker } from '@/components/tracker/DailyTracker';

export const metadata: Metadata = {
  title: 'Daily Tracker',
  description:
    'Track the six daily pillars, filtered water intake, and optional glucose/ketone readings. Get a daily letter grade and build a streak. Data stays in your browser.'
};

export default function TrackerPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl sm:text-4xl">Daily tracker</h1>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Check off today’s habits and earn your grade. Optional glucose/ketone logging computes
          your informational GKI. Everything is stored only on this device.
        </p>
      </header>
      <DailyTracker />
    </div>
  );
}
