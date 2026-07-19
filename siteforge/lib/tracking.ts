/**
 * Daily tracking + grading logic. Pure functions, unit-testable, no browser
 * APIs. Informational only — never framed as medical guidance.
 */

export interface DayEntry {
  date: string;
  /** pillar id -> completed (water handled via waterGlasses) */
  pillars: Record<string, boolean>;
  waterGlasses: number;
  glucoseMgDl: number | null;
  ketonesMmol: number | null;
}

const CHECKBOX_PILLARS = ['education', 'food', 'exercise', 'stress', 'chemicals'] as const;

/** Percentage 0–100 across the six pillars (water counts when >= 8 glasses). */
export function scoreDay(entry: DayEntry): number {
  const checks = CHECKBOX_PILLARS.filter((id) => entry.pillars[id]).length;
  const water = entry.waterGlasses >= 8 ? 1 : 0;
  return Math.round(((checks + water) / 6) * 100);
}

export function gradeForScore(score: number): string {
  if (score >= 100) return 'A+';
  if (score >= 83) return 'A';
  if (score >= 66) return 'B';
  if (score >= 50) return 'C';
  if (score >= 33) return 'D';
  return 'F';
}

/**
 * Glucose-Ketone Index: (glucose mg/dL ÷ 18) ÷ ketones mmol/L.
 * Returns null when inputs are missing or invalid.
 */
export function computeGki(glucoseMgDl: number | null, ketonesMmol: number | null): number | null {
  if (
    glucoseMgDl === null ||
    ketonesMmol === null ||
    !Number.isFinite(glucoseMgDl) ||
    !Number.isFinite(ketonesMmol) ||
    glucoseMgDl <= 0 ||
    ketonesMmol <= 0
  ) {
    return null;
  }
  return glucoseMgDl / 18 / ketonesMmol;
}

/** Informational zone label — descriptive, not a medical target. */
export function gkiZone(gki: number): string {
  if (gki < 1) return 'deep ketosis zone (informational)';
  if (gki < 3) return 'high ketosis zone (informational)';
  if (gki < 6) return 'moderate ketosis zone (informational)';
  if (gki < 9) return 'low ketosis zone (informational)';
  return 'typical glucose-fueled zone (informational)';
}
