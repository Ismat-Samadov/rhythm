'use client';

import { motion } from 'framer-motion';
import type { UIState } from '@/lib/types';
import {
  calculateAccuracy,
  getGrade,
  getGradeColor,
  formatScore,
  formatAccuracy,
  loadHighScores,
} from '@/lib/utils';
import { DIFFICULTY_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface ResultScreenProps {
  uiState: UIState;
  onPlayAgain: () => void;
  onMenu: () => void;
}

interface StatRowProps {
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
}

function StatRow({ label, value, color, delay = 0 }: StatRowProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.35 }}
      className="flex justify-between items-center py-2 border-b border-white/5"
    >
      <span className="font-mono text-white/40 text-xs uppercase tracking-widest">{label}</span>
      <span className="font-mono text-sm font-bold" style={{ color: color ?? '#ffffff' }}>
        {value}
      </span>
    </motion.div>
  );
}

/** Animated results / game-over screen */
export function ResultScreen({ uiState, onPlayAgain, onMenu }: ResultScreenProps) {
  const { score, combo, maxCombo, perfects, goods, misses, totalNotes, difficulty } = uiState;
  const accuracy = calculateAccuracy(uiState, totalNotes);
  const grade = getGrade(accuracy);
  const gradeColor = getGradeColor(grade);
  const diffCfg = DIFFICULTY_CONFIG[difficulty];
  const highScores = loadHighScores();
  const hs = highScores[difficulty];
  const isHighScore = hs?.score === score && score > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center z-30 bg-void-900/80 backdrop-blur-md overflow-y-auto py-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-80 max-w-[90vw] rounded-2xl border border-white/10 bg-void-800/90 backdrop-blur-xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
            className="font-display text-7xl font-black mb-1"
            style={{ color: gradeColor, textShadow: `0 0 30px ${gradeColor}80` }}
          >
            {grade}
          </motion.div>
          <div
            className="font-mono text-xs uppercase tracking-widest mb-0.5"
            style={{ color: diffCfg.color }}
          >
            {diffCfg.label}
          </div>
          {isHighScore && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-mono text-[10px] text-neon-gold animate-pulse-glow tracking-widest"
            >
              ★ NEW HIGH SCORE ★
            </motion.div>
          )}
        </div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-center mb-4 py-3 rounded-lg bg-white/[0.03] border border-white/5"
        >
          <div className="font-mono text-white/40 text-[10px] uppercase tracking-widest mb-0.5">
            Final Score
          </div>
          <div className="font-display text-3xl font-black text-white">
            {formatScore(score)}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-5">
          <StatRow label="Accuracy"   value={formatAccuracy(accuracy)} color={gradeColor} delay={0.35} />
          <StatRow label="Max Combo"  value={`${maxCombo}x`}          color="#00f5ff"    delay={0.40} />
          <StatRow label="Perfect"    value={perfects}                 color="#ffd700"    delay={0.45} />
          <StatRow label="Good"       value={goods}                    color="#00ff80"    delay={0.50} />
          <StatRow label="Miss"       value={misses}                   color="#ff4444"    delay={0.55} />
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col gap-2"
        >
          <Button variant="primary" size="md" onClick={onPlayAgain} className="w-full">
            ↺ Play Again
          </Button>
          <Button variant="ghost" size="md" onClick={onMenu} className="w-full">
            ⬡ Menu
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
