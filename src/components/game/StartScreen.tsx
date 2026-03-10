'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Difficulty, HighScore } from '@/lib/types';
import { DIFFICULTY_CONFIG } from '@/lib/constants';
import { loadHighScores, formatScore, formatAccuracy } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

/** Animated intro / menu screen */
export function StartScreen({ onStart }: StartScreenProps) {
  const [selected, setSelected] = useState<Difficulty>('medium');
  const highScores = loadHighScores();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-900 overflow-hidden">
      {/* Animated grid backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0d0d3040_0%,transparent_70%)]" />
        {/* Vertical grid lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/[0.03]"
            style={{ left: `${20 * (i + 1)}%` }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'backOut' }}
        className="mb-8 text-center"
      >
        <h1 className="font-display text-6xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink animate-pulse-glow">
          RHYTHM
        </h1>
        <p className="font-mono text-white/40 text-sm tracking-[0.4em] mt-1">
          NEON BEAT
        </p>
      </motion.div>

      {/* Difficulty selector */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-sm px-6 mb-6"
      >
        <p className="font-mono text-white/40 text-xs text-center mb-3 tracking-widest uppercase">
          Difficulty
        </p>
        <div className="flex gap-2">
          {difficulties.map(diff => {
            const cfg = DIFFICULTY_CONFIG[diff];
            const isSelected = selected === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelected(diff)}
                className={[
                  'flex-1 py-3 rounded font-mono text-xs font-bold uppercase tracking-widest',
                  'border-2 transition-all duration-200',
                  isSelected
                    ? `border-[${cfg.color}] text-[${cfg.color}] bg-[${cfg.color}]/10 shadow-[0_0_12px_${cfg.color}60]`
                    : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white/70',
                ].join(' ')}
                style={
                  isSelected
                    ? { borderColor: cfg.color, color: cfg.color, backgroundColor: `${cfg.color}18` }
                    : {}
                }
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
        <p className="font-mono text-white/30 text-xs text-center mt-2">
          {DIFFICULTY_CONFIG[selected].description}
        </p>
      </motion.div>

      {/* Play button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4, type: 'spring' }}
      >
        <Button size="lg" onClick={() => onStart(selected)} className="min-w-[180px]">
          ▶ Play
        </Button>
      </motion.div>

      {/* High scores */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 w-full max-w-sm px-6"
      >
        <p className="font-mono text-white/30 text-xs text-center mb-3 tracking-widest uppercase">
          Best Scores
        </p>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map(diff => {
            const hs: HighScore | undefined = highScores[diff];
            const cfg = DIFFICULTY_CONFIG[diff];
            return (
              <div
                key={diff}
                className="rounded p-2 border border-white/10 bg-white/[0.02] text-center"
              >
                <div className="font-mono text-[10px] mb-1" style={{ color: cfg.color }}>
                  {cfg.label}
                </div>
                {hs ? (
                  <>
                    <div className="font-mono text-white text-xs font-bold">
                      {formatScore(hs.score)}
                    </div>
                    <div className="font-mono text-white/40 text-[10px]">
                      {formatAccuracy(hs.accuracy)}
                    </div>
                  </>
                ) : (
                  <div className="font-mono text-white/20 text-[10px]">—</div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Controls reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="font-mono text-white/25 text-xs tracking-widest">
          Keys: <span className="text-neon-cyan">A S D F</span> &nbsp;|&nbsp; Pause:{' '}
          <span className="text-neon-purple">ESC / P</span>
        </p>
        <p className="font-mono text-white/20 text-[11px] mt-1">
          Mobile: tap the lane buttons
        </p>
      </motion.div>
    </div>
  );
}
