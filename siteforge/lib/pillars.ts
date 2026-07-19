/**
 * The six prevention-focused lifestyle pillars used by the education pages
 * and the daily tracker. Educational framing only.
 */
export interface Pillar {
  id: string;
  number: string;
  title: string;
  summary: string;
  dailyHabit: string;
  emoji: string;
}

export const pillars: Pillar[] = [
  {
    id: 'education',
    number: '01',
    title: 'Education',
    summary:
      'Learn how your metabolism works so healthier choices become obvious instead of effortful. Ten minutes of reading beats an hour of guessing.',
    dailyHabit: 'Read or watch 10 minutes of quality health education',
    emoji: '📚'
  },
  {
    id: 'food',
    number: '02',
    title: 'Food',
    summary:
      'Cut ultra-processed foods and build meals from whole ingredients. Your mitochondria run on what you feed them.',
    dailyHabit: 'Zero ultra-processed meals today; whole foods only',
    emoji: '🥦'
  },
  {
    id: 'exercise',
    number: '03',
    title: 'Exercise',
    summary:
      'Movement improves mitochondrial function and glucose handling. It does not need to be heroic — it needs to be daily.',
    dailyHabit: 'At least 30 minutes of intentional movement',
    emoji: '🏃'
  },
  {
    id: 'stress',
    number: '04',
    title: 'Reduce Stress',
    summary:
      'Chronic stress works against your body’s repair systems. Sleep, breath work, sunlight, and saying "no" are all training.',
    dailyHabit: '10+ minutes of deliberate stress reduction (and 7+ hours sleep)',
    emoji: '🧘'
  },
  {
    id: 'chemicals',
    number: '05',
    title: 'Remove Forever Chemicals',
    summary:
      'PFAS and microplastics accumulate in the body. Swap nonstick and plastic food contact for stainless, cast iron, and glass.',
    dailyHabit: 'One swap or avoidance: no plastic-heated food, PFAS-free choices',
    emoji: '🧪'
  },
  {
    id: 'water',
    number: '06',
    title: 'Water Supply',
    summary:
      'Filtered water cuts exposure to chemicals and heavy metals while keeping you hydrated enough for your metabolism to do its job.',
    dailyHabit: 'Drink 8 glasses of filtered water',
    emoji: '💧'
  }
];
