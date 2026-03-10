import type { Difficulty } from './types';

/** Number of note lanes */
export const LANE_COUNT = 4;

/** Keyboard keys mapped to lanes 0-3 */
export const LANE_KEYS = ['A', 'S', 'D', 'F'];

/** KeyboardEvent.code values for the lane keys */
export const LANE_KEY_CODES = ['KeyA', 'KeyS', 'KeyD', 'KeyF'];

/** Neon color scheme for each lane */
export const LANE_COLORS = [
  {
    base: '#00f5ff',                        // cyan
    glow: 'rgba(0, 245, 255, 0.7)',
    dark: 'rgba(0, 245, 255, 0.08)',
    shadow: 'rgba(0, 245, 255, 0.4)',
  },
  {
    base: '#bf00ff',                        // purple
    glow: 'rgba(191, 0, 255, 0.7)',
    dark: 'rgba(191, 0, 255, 0.08)',
    shadow: 'rgba(191, 0, 255, 0.4)',
  },
  {
    base: '#ffff00',                        // yellow
    glow: 'rgba(255, 255, 0, 0.7)',
    dark: 'rgba(255, 255, 0, 0.08)',
    shadow: 'rgba(255, 255, 0, 0.4)',
  },
  {
    base: '#ff007f',                        // pink/magenta
    glow: 'rgba(255, 0, 127, 0.7)',
    dark: 'rgba(255, 0, 127, 0.08)',
    shadow: 'rgba(255, 0, 127, 0.4)',
  },
] as const;

/** Hit zone position as fraction of canvas height (from top) */
export const HIT_ZONE_RATIO = 0.82;

/** Height of each note in CSS pixels */
export const NOTE_HEIGHT = 38;

/** Horizontal padding on each side of a note within its lane */
export const NOTE_PADDING = 10;

/** Radius of hit zone circles */
export const HIT_CIRCLE_RADIUS_RATIO = 0.2; // fraction of lane width

/** Milliseconds hit result feedback stays on screen */
export const FEEDBACK_DURATION_MS = 700;

/** Per-difficulty configuration */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    bpm: number;
    /** Ms for a note to travel from top to hit zone */
    travelTime: number;
    totalMeasures: number;
    label: string;
    color: string;
    description: string;
  }
> = {
  easy: {
    bpm: 90,
    travelTime: 2800,
    totalMeasures: 20,
    label: 'Easy',
    color: '#00ff80',
    description: 'Chill vibes. Perfect for beginners.',
  },
  medium: {
    bpm: 128,
    travelTime: 2200,
    totalMeasures: 28,
    label: 'Medium',
    color: '#00f5ff',
    description: 'Feel the rhythm. Bring your A-game.',
  },
  hard: {
    bpm: 160,
    travelTime: 1500,
    totalMeasures: 36,
    label: 'Hard',
    color: '#ff007f',
    description: 'Maximum overdrive. Are you ready?',
  },
};

/** Hit timing windows in milliseconds */
export const HIT_WINDOWS = {
  /** Perfect hit window (±ms from exact timing) */
  perfect: 50,
  /** Good hit window (±ms from exact timing) */
  good: 110,
} as const;

/** Extra ms after the good window before auto-miss is triggered */
export const MISS_WINDOW_EXTRA = 55;

/** Score awarded for each hit type (before multiplier) */
export const SCORE_VALUES = {
  perfect: 300,
  good: 100,
} as const;

/** Combo thresholds that increase the score multiplier */
export const COMBO_MULTIPLIERS: { min: number; multiplier: number }[] = [
  { min: 50, multiplier: 8 },
  { min: 25, multiplier: 4 },
  { min: 10, multiplier: 2 },
  { min: 0, multiplier: 1 },
];

/** Number of particles spawned on a perfect hit */
export const PERFECT_PARTICLE_COUNT = 18;

/** Number of particles spawned on a good hit */
export const GOOD_PARTICLE_COUNT = 10;

/** localStorage key for persisted high scores */
export const HIGH_SCORES_KEY = 'rhythm_high_scores';

/** Countdown duration before game starts */
export const COUNTDOWN_SECONDS = 3;
