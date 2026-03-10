import type { GameStats, GameResult, HighScore, HitResult } from './types';
import type { Difficulty } from './types';
import {
  COMBO_MULTIPLIERS,
  HIGH_SCORES_KEY,
  SCORE_VALUES,
  HIT_WINDOWS,
  MISS_WINDOW_EXTRA,
} from './constants';

/** Returns the score multiplier for a given combo count */
export function getMultiplier(combo: number): number {
  for (const { min, multiplier } of COMBO_MULTIPLIERS) {
    if (combo >= min) return multiplier;
  }
  return 1;
}

/** Determines hit result based on timing difference */
export function getHitResult(timeDiffMs: number): HitResult | null {
  const abs = Math.abs(timeDiffMs);
  if (abs <= HIT_WINDOWS.perfect) return 'perfect';
  if (abs <= HIT_WINDOWS.good) return 'good';
  // Still within the grace window (note hasn't auto-missed yet)
  if (abs <= HIT_WINDOWS.good + MISS_WINDOW_EXTRA) return 'good';
  return null;
}

/** Calculates accuracy as a 0-100 percentage */
export function calculateAccuracy(stats: GameStats, totalNotes: number): number {
  if (totalNotes === 0) return 0;
  const maxScore = totalNotes * SCORE_VALUES.perfect;
  const earned = stats.perfects * SCORE_VALUES.perfect + stats.goods * SCORE_VALUES.good;
  return Math.round((earned / maxScore) * 100 * 10) / 10;
}

/** Assigns a letter grade based on accuracy */
export function getGrade(accuracy: number): GameResult['grade'] {
  if (accuracy >= 95) return 'S';
  if (accuracy >= 85) return 'A';
  if (accuracy >= 70) return 'B';
  if (accuracy >= 50) return 'C';
  return 'F';
}

/** Formats a score number with comma separators */
export function formatScore(score: number): string {
  return score.toLocaleString();
}

/** Formats accuracy with one decimal place */
export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(1)}%`;
}

/** Loads high scores from localStorage */
export function loadHighScores(): Partial<Record<Difficulty, HighScore>> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    return stored ? (JSON.parse(stored) as Partial<Record<Difficulty, HighScore>>) : {};
  } catch {
    return {};
  }
}

/** Saves a high score to localStorage; returns true if it was a new record */
export function saveHighScore(
  difficulty: Difficulty,
  stats: GameStats,
  accuracy: number,
  totalNotes: number,
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = loadHighScores();
    const existing = current[difficulty];
    if (existing && existing.score >= stats.score) return false;

    current[difficulty] = {
      score: stats.score,
      combo: stats.maxCombo,
      accuracy,
      difficulty,
      date: new Date().toLocaleDateString(),
    };
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(current));
    return true;
  } catch {
    return false;
  }
}

/** Clamps a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Returns the grade color for display */
export function getGradeColor(grade: GameResult['grade']): string {
  switch (grade) {
    case 'S': return '#ffd700';
    case 'A': return '#00f5ff';
    case 'B': return '#00ff80';
    case 'C': return '#ffff00';
    case 'F': return '#ff4444';
  }
}

/** Returns a human-readable multiplier label */
export function getMultiplierLabel(combo: number): string {
  const m = getMultiplier(combo);
  return m > 1 ? `×${m}` : '';
}
