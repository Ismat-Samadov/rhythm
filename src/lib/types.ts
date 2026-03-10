/** Core type definitions for the Rhythm game */

export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'gameover';

export type HitResult = 'perfect' | 'good' | 'miss';

export type NoteState = 'incoming' | 'hit' | 'missed';

/** A single note in the beatmap */
export interface Note {
  id: string;
  /** Which lane (0-3) this note belongs to */
  lane: number;
  /** Time in milliseconds from game start when note should be hit */
  hitTime: number;
  /** Current render state */
  state: NoteState;
  /** Result when the note was hit by the player */
  hitResult?: HitResult;
}

/** A particle spawned on note hit */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Remaining life frames */
  life: number;
  /** Starting life (for alpha calculation) */
  maxLife: number;
  color: string;
  size: number;
}

/** Visual feedback shown above a lane after a hit/miss */
export interface HitFeedback {
  id: string;
  lane: number;
  result: HitResult;
  /** performance.now() timestamp when this was created */
  timestamp: number;
}

/** All game statistics */
export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  perfects: number;
  goods: number;
  misses: number;
}

/** UI-facing game state (React state) */
export interface UIState extends GameStats {
  status: GameStatus;
  difficulty: Difficulty;
  /** 0-1 progress through the song */
  progress: number;
  /** Total notes in the current beatmap */
  totalNotes: number;
  /** Countdown value (3, 2, 1) */
  countdown: number;
}

/** Internal mutable game data held in refs (not React state) */
export interface GameData {
  notes: Note[];
  particles: Particle[];
  hitFeedbacks: HitFeedback[];
  /** Which lanes are currently pressed */
  laneActive: [boolean, boolean, boolean, boolean];
  score: number;
  combo: number;
  maxCombo: number;
  perfects: number;
  goods: number;
  misses: number;
  status: GameStatus;
  difficulty: Difficulty;
  /** performance.now() when the game started (after countdown) */
  startTime: number;
  /** performance.now() when pause was initiated */
  pauseStartTime: number;
  /** Total accumulated pause time in ms */
  totalPauseTime: number;
  /** Current elapsed game time in ms */
  elapsed: number;
  /** Total song duration in ms */
  totalDuration: number;
  /** Whether music is enabled */
  musicEnabled: boolean;
  /** Whether SFX are enabled */
  sfxEnabled: boolean;
}

/** Persisted high score record */
export interface HighScore {
  score: number;
  combo: number;
  accuracy: number;
  difficulty: Difficulty;
  date: string;
}

/** Computed accuracy and grade for the results screen */
export interface GameResult extends GameStats {
  accuracy: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  totalNotes: number;
  difficulty: Difficulty;
  isHighScore: boolean;
}
