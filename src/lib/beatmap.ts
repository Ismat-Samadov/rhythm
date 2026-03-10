import type { Note, Difficulty } from './types';
import { DIFFICULTY_CONFIG } from './constants';

/** A single note position in a pattern: [beat_offset, lane] */
type PatternNote = [number, number];

/** A measure pattern: array of [beat_offset (0-3.75), lane (0-3)] */
type Pattern = PatternNote[];

// ─── Easy patterns ──────────────────────────────────────────────────────────
// Simple, 2-4 notes per measure, mostly quarter and half notes
const EASY_PATTERNS: Pattern[] = [
  [[0, 0], [2, 2]],
  [[0, 1], [2, 3]],
  [[0, 0], [1, 2], [2, 1], [3, 3]],
  [[0, 3], [2, 0]],
  [[0, 0], [1, 1], [2, 2]],
  [[1, 2], [3, 0]],
  [[0, 1], [2, 3], [3, 0]],
  [[0, 0], [1, 3], [2, 1], [3, 2]],
  [[0, 2], [1, 0], [3, 1]],
  [[0, 0], [2, 1], [3, 3]],
  [[0, 3], [1, 1], [2, 0]],
  [[0, 2], [2, 0], [3, 2]],
];

// ─── Medium patterns ─────────────────────────────────────────────────────────
// 4-6 notes per measure, eighth notes (0.5 increments)
const MEDIUM_PATTERNS: Pattern[] = [
  [[0, 0], [0.5, 1], [1, 2], [2, 3], [3, 0]],
  [[0, 1], [1, 0], [1.5, 2], [2, 1], [3, 3]],
  [[0, 0], [0.5, 2], [1, 1], [2, 3], [2.5, 0], [3, 2]],
  [[0, 3], [1, 2], [1.5, 1], [2, 0], [3, 1]],
  [[0, 0], [0.5, 0], [1, 2], [1.5, 2], [2, 1], [3, 3]],
  [[0, 2], [0.5, 3], [1.5, 0], [2, 1], [2.5, 2], [3.5, 3]],
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [[0, 1], [0.5, 3], [1.5, 0], [2.5, 2], [3, 1], [3.5, 3]],
  [[0, 0], [0.5, 2], [1, 3], [2, 1], [2.5, 0], [3, 3]],
  [[0, 2], [1, 0], [1.5, 3], [2, 1], [3, 2], [3.5, 0]],
  [[0, 1], [1, 2], [1.5, 3], [2, 0], [2.5, 1], [3, 2]],
  [[0, 3], [0.5, 2], [1, 1], [2, 0], [2.5, 1], [3.5, 3]],
];

// ─── Hard patterns ───────────────────────────────────────────────────────────
// 7-12 notes per measure, sixteenth notes (0.25 increments), simultaneous hits
const HARD_PATTERNS: Pattern[] = [
  [[0, 0], [0.25, 1], [0.5, 2], [0.75, 3], [1, 0], [1.5, 2], [2, 1], [2.5, 3], [3, 0], [3.5, 2]],
  [[0, 2], [0.5, 3], [0.75, 0], [1, 1], [1.5, 2], [1.75, 3], [2, 0], [2.5, 1], [3, 2], [3.75, 3]],
  [[0, 0], [0.5, 2], [1, 0], [1, 3], [1.5, 1], [2, 3], [2.5, 0], [3, 2], [3.5, 1]],
  [[0, 1], [0, 3], [0.5, 0], [1, 2], [1.5, 1], [2, 0], [2, 3], [2.5, 2], [3, 0], [3.5, 1]],
  [[0, 0], [0.25, 1], [0.5, 2], [0.75, 3], [1, 3], [1.25, 2], [1.5, 1], [1.75, 0], [2, 0], [2.5, 2], [3, 1], [3.5, 3]],
  [[0, 2], [0.5, 0], [1, 3], [1, 1], [1.5, 2], [2, 0], [2.25, 1], [2.5, 2], [2.75, 3], [3, 0], [3.5, 2]],
  [[0, 0], [0.5, 1], [1, 2], [1.5, 3], [2, 0], [2, 2], [2.5, 1], [3, 3], [3, 0], [3.5, 2]],
  [[0, 3], [0.25, 2], [0.5, 1], [0.75, 0], [1, 1], [1.5, 3], [2, 0], [2.5, 2], [3, 1], [3.25, 3], [3.5, 0]],
];

// ─── Song structure sections ──────────────────────────────────────────────────

interface Section {
  /** Pattern set to draw from */
  set: 'easy' | 'medium' | 'hard';
  /** Which pattern indices in the set to cycle through */
  patternIndices: number[];
  /** How many measures this section spans */
  measures: number;
}

// Easy song structure: 20 measures total
const EASY_STRUCTURE: Section[] = [
  { set: 'easy', patternIndices: [0, 1],               measures: 2  }, // intro
  { set: 'easy', patternIndices: [0, 1, 2, 3],         measures: 4  }, // verse A
  { set: 'easy', patternIndices: [4, 5, 6, 7],         measures: 4  }, // chorus
  { set: 'easy', patternIndices: [8, 9, 10, 11],       measures: 4  }, // verse B
  { set: 'easy', patternIndices: [4, 5, 6, 7],         measures: 4  }, // chorus
  { set: 'easy', patternIndices: [0, 7],               measures: 2  }, // outro
];

// Medium song structure: 28 measures total
const MEDIUM_STRUCTURE: Section[] = [
  { set: 'easy',   patternIndices: [6, 7],               measures: 2  }, // intro
  { set: 'medium', patternIndices: [0, 1, 2, 3],         measures: 4  }, // verse A
  { set: 'medium', patternIndices: [4, 5, 6, 7],         measures: 4  }, // chorus
  { set: 'medium', patternIndices: [8, 9, 10, 11],       measures: 4  }, // bridge
  { set: 'medium', patternIndices: [4, 5, 6, 7],         measures: 4  }, // chorus repeat
  { set: 'medium', patternIndices: [0, 1, 2, 3],         measures: 4  }, // verse B
  { set: 'medium', patternIndices: [4, 5, 6, 7],         measures: 4  }, // final chorus
  { set: 'easy',   patternIndices: [6, 7],               measures: 2  }, // outro
];

// Hard song structure: 36 measures total
const HARD_STRUCTURE: Section[] = [
  { set: 'medium', patternIndices: [0, 1, 2, 3],         measures: 2  }, // intro
  { set: 'hard',   patternIndices: [0, 1, 2, 3],         measures: 4  }, // verse A
  { set: 'hard',   patternIndices: [4, 5, 6, 7],         measures: 6  }, // chorus
  { set: 'medium', patternIndices: [4, 5, 6, 7],         measures: 4  }, // break
  { set: 'hard',   patternIndices: [0, 1, 2, 3],         measures: 4  }, // verse B
  { set: 'hard',   patternIndices: [4, 5, 6, 7],         measures: 8  }, // final chorus
  { set: 'hard',   patternIndices: [0, 1, 2, 3],         measures: 4  }, // breakdown
  { set: 'medium', patternIndices: [0, 1, 2, 3],         measures: 4  }, // outro
];

const STRUCTURE_MAP = {
  easy:   EASY_STRUCTURE,
  medium: MEDIUM_STRUCTURE,
  hard:   HARD_STRUCTURE,
} as const;

const PATTERN_MAP = {
  easy:   EASY_PATTERNS,
  medium: MEDIUM_PATTERNS,
  hard:   HARD_PATTERNS,
} as const;

/**
 * Generates a complete beatmap (sorted array of Notes) for the given difficulty.
 * Notes are positioned in time using BPM from DIFFICULTY_CONFIG.
 */
export function generateBeatmap(difficulty: Difficulty): Note[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const msPerBeat = 60_000 / config.bpm;
  const structure = STRUCTURE_MAP[difficulty];

  const notes: Note[] = [];
  let measureIdx = 0;
  let noteId = 0;

  for (const section of structure) {
    const patternSet = PATTERN_MAP[section.set];

    for (let i = 0; i < section.measures; i++) {
      const pIdx = section.patternIndices[i % section.patternIndices.length];
      const pattern = patternSet[pIdx % patternSet.length];

      for (const [beatOffset, lane] of pattern) {
        const hitTime = (measureIdx * 4 + beatOffset) * msPerBeat;
        notes.push({
          id: `n${noteId++}`,
          lane,
          hitTime,
          state: 'incoming',
        });
      }

      measureIdx++;
    }
  }

  // Sort by ascending hit time (patterns within a measure may be defined out-of-order)
  notes.sort((a, b) => a.hitTime - b.hitTime);

  return notes;
}

/**
 * Returns the total song duration in milliseconds (including a 3-second tail
 * after the last note so the game doesn't abruptly end).
 */
export function getTotalDuration(difficulty: Difficulty): number {
  const config = DIFFICULTY_CONFIG[difficulty];
  const msPerBeat = 60_000 / config.bpm;
  return config.totalMeasures * 4 * msPerBeat + 3_000;
}
