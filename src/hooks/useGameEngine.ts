'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Difficulty, GameData, UIState, Note, Particle, HitFeedback } from '@/lib/types';
import {
  LANE_COLORS,
  HIT_ZONE_RATIO,
  NOTE_HEIGHT,
  NOTE_PADDING,
  DIFFICULTY_CONFIG,
  HIT_WINDOWS,
  MISS_WINDOW_EXTRA,
  SCORE_VALUES,
  FEEDBACK_DURATION_MS,
  PERFECT_PARTICLE_COUNT,
  GOOD_PARTICLE_COUNT,
  LANE_KEYS,
  LANE_COUNT,
} from '@/lib/constants';
import {
  getMultiplier,
  getHitResult,
  calculateAccuracy,
  getGrade,
  saveHighScore,
} from '@/lib/utils';
import { generateBeatmap, getTotalDuration } from '@/lib/beatmap';
import { audioEngine } from '@/lib/audioEngine';

// ─── Canvas renderer ──────────────────────────────────────────────────────────

/**
 * Pure function that draws the entire game frame onto the given canvas context.
 * Reads from the mutable GameData ref — no React state involved.
 */
function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: GameData,
  rafTimestamp: number,
): void {
  const laneW = width / LANE_COUNT;
  const hitY = height * HIT_ZONE_RATIO;
  const config = DIFFICULTY_CONFIG[data.difficulty];

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, width, height);

  // Subtle scanline effect
  for (let y = 0; y < height; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, y, width, 1);
  }

  // ── Active lane backgrounds ───────────────────────────────────────────────
  LANE_COLORS.forEach((color, i) => {
    if (data.laneActive[i]) {
      ctx.fillStyle = color.dark;
      ctx.fillRect(i * laneW, 0, laneW, height);
    }
  });

  // ── Grid lines (horizontal) ───────────────────────────────────────────────
  const gridSpacing = 80;
  const gridOffset = (data.elapsed * 0.05) % gridSpacing;
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let y = -gridSpacing + gridOffset; y < height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // ── Lane dividers ─────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  for (let i = 1; i < LANE_COUNT; i++) {
    ctx.beginPath();
    ctx.moveTo(i * laneW, 0);
    ctx.lineTo(i * laneW, height);
    ctx.stroke();
  }

  // ── Notes ─────────────────────────────────────────────────────────────────
  for (const note of data.notes) {
    if (note.state === 'hit') continue; // don't draw already-hit notes

    const color = LANE_COLORS[note.lane];
    const timeDiff = data.elapsed - note.hitTime;
    // Position: noteY = hitY when elapsed === hitTime
    const noteY = hitY + (timeDiff / config.travelTime) * hitY;

    // Cull notes outside the visible area
    if (noteY + NOTE_HEIGHT < 0 || noteY - NOTE_HEIGHT > height) continue;

    const x = note.lane * laneW + NOTE_PADDING;
    const y = noteY - NOTE_HEIGHT / 2;
    const w = laneW - NOTE_PADDING * 2;
    const h = NOTE_HEIGHT;
    const r = 7; // corner radius

    if (note.state === 'missed') {
      // Faded grey for missed notes
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(80,80,100,0.35)';
    } else {
      ctx.shadowBlur = 18;
      ctx.shadowColor = color.glow;
      ctx.fillStyle = color.base;
    }

    // Rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    // Inner highlight stripe (top edge)
    if (note.state !== 'missed') {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillRect(x + 6, y + 5, w - 12, 5);
    }

    ctx.shadowBlur = 0;
  }

  // ── Hit zone line ─────────────────────────────────────────────────────────
  ctx.shadowBlur = 14;
  ctx.shadowColor = 'rgba(255,255,255,0.6)';
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, hitY);
  ctx.lineTo(width, hitY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ── Hit zone circles ──────────────────────────────────────────────────────
  LANE_COLORS.forEach((color, i) => {
    const cx = i * laneW + laneW / 2;
    const cy = hitY;
    const r = laneW * 0.22;
    const active = data.laneActive[i];

    // Outer glow ring
    ctx.shadowBlur = active ? 25 : 8;
    ctx.shadowColor = color.glow;
    ctx.strokeStyle = active ? color.base : 'rgba(255,255,255,0.25)';
    ctx.lineWidth = active ? 3 : 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Fill when active
    if (active) {
      ctx.fillStyle = color.dark;
      ctx.beginPath();
      ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    // Key label below hit zone
    ctx.fillStyle = active ? color.base : 'rgba(255,255,255,0.3)';
    ctx.font = `bold ${Math.max(11, laneW * 0.14)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(LANE_KEYS[i], cx, cy + r + 18);
  });

  // ── Particles ─────────────────────────────────────────────────────────────
  for (const p of data.particles) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha * alpha; // quadratic fade
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // ── Hit feedback text ─────────────────────────────────────────────────────
  for (const fb of data.hitFeedbacks) {
    const age = rafTimestamp - fb.timestamp;
    if (age > FEEDBACK_DURATION_MS) continue;

    const progress = age / FEEDBACK_DURATION_MS;
    const alpha = 1 - progress;
    const cx = fb.lane * laneW + laneW / 2;
    const baseY = hitY - 80;
    const y = baseY - progress * 55;

    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';

    const fontSize = Math.max(13, laneW * 0.13);

    if (fb.result === 'perfect') {
      ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
      ctx.fillStyle = '#ffd700';
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 12;
      ctx.fillText('PERFECT', cx, y);
    } else if (fb.result === 'good') {
      ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
      ctx.fillStyle = '#00ff80';
      ctx.shadowColor = '#00ff80';
      ctx.shadowBlur = 10;
      ctx.fillText('GOOD', cx, y);
    } else {
      ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
      ctx.fillStyle = '#ff4444';
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = 10;
      ctx.fillText('MISS', cx, y);
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ─── Particle factory ─────────────────────────────────────────────────────────

function spawnParticles(
  x: number,
  y: number,
  color: string,
  count: number,
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 40 + Math.floor(Math.random() * 20),
      maxLife: 60,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

// ─── Initial state factories ──────────────────────────────────────────────────

function makeInitialGameData(difficulty: Difficulty): GameData {
  return {
    notes: [],
    particles: [],
    hitFeedbacks: [],
    laneActive: [false, false, false, false],
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfects: 0,
    goods: 0,
    misses: 0,
    status: 'idle',
    difficulty,
    startTime: 0,
    pauseStartTime: 0,
    totalPauseTime: 0,
    elapsed: 0,
    totalDuration: 0,
    musicEnabled: true,
    sfxEnabled: true,
  };
}

function makeInitialUIState(difficulty: Difficulty): UIState {
  return {
    status: 'idle',
    difficulty,
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfects: 0,
    goods: 0,
    misses: 0,
    progress: 0,
    totalNotes: 0,
    countdown: 3,
  };
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useGameEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<GameData>(makeInitialGameData('medium'));
  const rafRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [uiState, setUiState] = useState<UIState>(makeInitialUIState('medium'));

  // Keep a stable reference to total notes so we can compute progress
  const totalNotesRef = useRef<number>(0);

  // ── Canvas sizing ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Sync UI state from mutable ref ───────────────────────────────────────
  const syncUI = useCallback((override?: Partial<UIState>) => {
    const d = dataRef.current;
    setUiState(prev => ({
      ...prev,
      status: d.status,
      difficulty: d.difficulty,
      score: d.score,
      combo: d.combo,
      maxCombo: d.maxCombo,
      perfects: d.perfects,
      goods: d.goods,
      misses: d.misses,
      progress: d.totalDuration > 0
        ? Math.min(d.elapsed / (d.totalDuration - 3000), 1)
        : 0,
      totalNotes: totalNotesRef.current,
      ...override,
    }));
  }, []);

  // ── Game loop ─────────────────────────────────────────────────────────────
  const gameLoop = useCallback((rafTs: number) => {
    const d = dataRef.current;
    const canvas = canvasRef.current;
    if (!canvas || d.status !== 'playing') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Elapsed time since game start (excluding pauses)
    const now = performance.now();
    d.elapsed = now - d.startTime - d.totalPauseTime;

    // ── Auto-miss detection ─────────────────────────────────────────────────
    for (const note of d.notes) {
      if (note.state !== 'incoming') continue;
      const diff = d.elapsed - note.hitTime;
      if (diff > HIT_WINDOWS.good + MISS_WINDOW_EXTRA) {
        note.state = 'missed';
        d.combo = 0;
        d.misses++;
        if (d.sfxEnabled) audioEngine.playMissSfx();
        d.hitFeedbacks.push({
          id: `miss-${note.id}`,
          lane: note.lane,
          result: 'miss',
          timestamp: rafTs,
        });
      }
    }

    // ── Update particles ────────────────────────────────────────────────────
    d.particles = d.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gravity
      p.vx *= 0.97; // friction
      p.life--;
      return p.life > 0;
    });

    // ── Cull old feedback ───────────────────────────────────────────────────
    d.hitFeedbacks = d.hitFeedbacks.filter(
      fb => rafTs - fb.timestamp < FEEDBACK_DURATION_MS + 100,
    );

    // ── Render ──────────────────────────────────────────────────────────────
    renderFrame(ctx, canvas.width, canvas.height, d, rafTs);

    // ── Check game over ─────────────────────────────────────────────────────
    const allDone = d.notes.every(n => n.state !== 'incoming');
    if (allDone && d.elapsed >= d.totalDuration - 3000) {
      d.status = 'gameover';
      audioEngine.stopMusic();
      audioEngine.playVictoryFanfare();

      // Persist high score
      const accuracy = calculateAccuracy(d, totalNotesRef.current);
      saveHighScore(d.difficulty, d, accuracy, totalNotesRef.current);

      syncUI();
      return; // stop loop
    }

    // ── Update UI (React batches these at 60 fps) ──────────────────────────
    setUiState(prev => ({
      ...prev,
      score: d.score,
      combo: d.combo,
      progress: d.totalDuration > 0
        ? Math.min(d.elapsed / (d.totalDuration - 3000), 1)
        : 0,
    }));

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [syncUI]);

  // ── Start game ────────────────────────────────────────────────────────────
  const startGame = useCallback((difficulty: Difficulty) => {
    // Cancel any running loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    const beatmap = generateBeatmap(difficulty);
    const totalDuration = getTotalDuration(difficulty);
    totalNotesRef.current = beatmap.length;

    // Reset game data
    const d = dataRef.current;
    Object.assign(d, makeInitialGameData(difficulty));
    d.notes = beatmap;
    d.totalDuration = totalDuration;
    d.difficulty = difficulty;
    d.status = 'countdown';

    // Initialize audio engine
    audioEngine.initialize();

    let count = 3;
    setUiState(prev => ({ ...prev, status: 'countdown', difficulty, countdown: count, totalNotes: beatmap.length }));
    audioEngine.playCountdownBeep(false);

    countdownTimerRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        audioEngine.playCountdownBeep(false);
        setUiState(prev => ({ ...prev, countdown: count }));
      } else {
        clearInterval(countdownTimerRef.current!);
        countdownTimerRef.current = null;
        audioEngine.playCountdownBeep(true);

        d.status = 'playing';
        d.startTime = performance.now();
        d.totalPauseTime = 0;
        d.pauseStartTime = 0;

        // Start background music
        if (d.musicEnabled) {
          audioEngine.startMusic(DIFFICULTY_CONFIG[difficulty].bpm);
        }

        syncUI({ status: 'playing', countdown: 0 });
        rafRef.current = requestAnimationFrame(gameLoop);
      }
    }, 1000);
  }, [gameLoop, syncUI]);

  // ── Pause / Resume ────────────────────────────────────────────────────────
  const pauseGame = useCallback(() => {
    const d = dataRef.current;
    if (d.status !== 'playing') return;

    d.status = 'paused';
    d.pauseStartTime = performance.now();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioEngine.stopMusic();
    audioEngine.suspend();
    syncUI({ status: 'paused' });
  }, [syncUI]);

  const resumeGame = useCallback(() => {
    const d = dataRef.current;
    if (d.status !== 'paused') return;

    d.totalPauseTime += performance.now() - d.pauseStartTime;
    d.status = 'playing';
    audioEngine.resume();
    if (d.musicEnabled) {
      audioEngine.startMusic(DIFFICULTY_CONFIG[d.difficulty].bpm);
    }
    syncUI({ status: 'playing' });
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop, syncUI]);

  // ── Restart ───────────────────────────────────────────────────────────────
  const restartGame = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioEngine.stopMusic();
    const { difficulty } = dataRef.current;
    startGame(difficulty);
  }, [startGame]);

  // ── Go to menu ────────────────────────────────────────────────────────────
  const goToMenu = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    audioEngine.stopMusic();
    const d = dataRef.current;
    d.status = 'idle';
    syncUI({ status: 'idle' });
  }, [syncUI]);

  // ── Lane press / release ──────────────────────────────────────────────────
  const pressLane = useCallback((lane: number) => {
    const d = dataRef.current;
    if (d.status !== 'playing') return;

    d.laneActive[lane as 0 | 1 | 2 | 3] = true;

    const now = performance.now();
    const elapsed = now - d.startTime - d.totalPauseTime;

    // Find the closest active note in this lane within the hit window
    let closest: Note | null = null;
    let closestDiff = Infinity;

    for (const note of d.notes) {
      if (note.lane !== lane || note.state !== 'incoming') continue;
      const diff = elapsed - note.hitTime; // negative = early
      const absDiff = Math.abs(diff);
      if (absDiff <= HIT_WINDOWS.good + MISS_WINDOW_EXTRA && absDiff < closestDiff) {
        closest = note;
        closestDiff = absDiff;
      }
    }

    if (!closest) return; // no note to hit

    const result = getHitResult(elapsed - closest.hitTime);
    if (!result || result === 'miss') return;

    // Mark note as hit
    closest.state = 'hit';
    closest.hitResult = result;

    // Update score
    const multiplier = getMultiplier(d.combo);
    d.score += SCORE_VALUES[result] * multiplier;
    d.combo++;
    d.maxCombo = Math.max(d.maxCombo, d.combo);
    if (result === 'perfect') d.perfects++;
    else d.goods++;

    // Spawn particles at note position
    const canvas = canvasRef.current;
    if (canvas) {
      const laneW = canvas.width / LANE_COUNT;
      const cx = lane * laneW + laneW / 2;
      const hitY = canvas.height * HIT_ZONE_RATIO;
      const count = result === 'perfect' ? PERFECT_PARTICLE_COUNT : GOOD_PARTICLE_COUNT;
      d.particles.push(...spawnParticles(cx, hitY, LANE_COLORS[lane].base, count));
    }

    // Hit feedback
    d.hitFeedbacks.push({
      id: `hit-${closest.id}`,
      lane,
      result,
      timestamp: performance.now(),
    });

    // SFX
    if (d.sfxEnabled) audioEngine.playHitSfx(result);
  }, []);

  const releaseLane = useCallback((lane: number) => {
    dataRef.current.laneActive[lane as 0 | 1 | 2 | 3] = false;
  }, []);

  // ── Sound toggles ─────────────────────────────────────────────────────────
  const toggleMusic = useCallback(() => {
    const d = dataRef.current;
    d.musicEnabled = !d.musicEnabled;
    audioEngine.setMusicEnabled(d.musicEnabled);
    setUiState(prev => ({ ...prev })); // trigger re-render for toggle icon
    return d.musicEnabled;
  }, []);

  const toggleSfx = useCallback(() => {
    const d = dataRef.current;
    d.sfxEnabled = !d.sfxEnabled;
    audioEngine.setSfxEnabled(d.sfxEnabled);
    return d.sfxEnabled;
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      audioEngine.destroy();
    };
  }, []);

  // ── Expose state for sound toggles ───────────────────────────────────────
  const musicEnabled = dataRef.current.musicEnabled;
  const sfxEnabled = dataRef.current.sfxEnabled;

  return {
    canvasRef,
    uiState,
    musicEnabled,
    sfxEnabled,
    pressLane,
    releaseLane,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    goToMenu,
    toggleMusic,
    toggleSfx,
  };
}
