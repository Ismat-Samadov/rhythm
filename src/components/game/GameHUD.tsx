'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { UIState } from '@/lib/types';
import { formatScore, getMultiplier, getMultiplierLabel } from '@/lib/utils';
import { DIFFICULTY_CONFIG } from '@/lib/constants';

interface GameHUDProps {
  uiState: UIState;
  onPause: () => void;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
}

/** In-game heads-up display — score, combo, progress, controls */
export function GameHUD({
  uiState,
  onPause,
  musicEnabled,
  sfxEnabled,
  onToggleMusic,
  onToggleSfx,
}: GameHUDProps) {
  const { score, combo, progress, difficulty, status } = uiState;
  const multiplier = getMultiplier(combo);
  const multiplierLabel = getMultiplierLabel(combo);
  const diffCfg = DIFFICULTY_CONFIG[difficulty];

  return (
    <div className="relative z-10 flex items-center gap-3 px-3 py-2 bg-void-900/80 backdrop-blur-sm border-b border-white/5">
      {/* Score */}
      <div className="flex-1 min-w-0">
        <div className="font-mono text-white/40 text-[10px] uppercase tracking-widest">Score</div>
        <motion.div
          key={score}
          initial={{ scale: 1.15, color: '#00f5ff' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.2 }}
          className="font-display text-lg font-black text-white leading-none"
        >
          {formatScore(score)}
        </motion.div>
      </div>

      {/* Combo + multiplier */}
      <div className="text-center min-w-[70px]">
        <AnimatePresence mode="popLayout">
          {combo > 0 && (
            <motion.div
              key={combo}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              <div className="font-display text-2xl font-black text-neon-cyan leading-none">
                {combo}
              </div>
              <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                combo{multiplierLabel && (
                  <span className="text-neon-gold ml-1">{multiplierLabel}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar + diff label */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ color: diffCfg.color }}
          >
            {diffCfg.label}
          </span>
          <span className="font-mono text-white/30 text-[10px]">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: diffCfg.color }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Sound toggles + pause */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleSfx}
          title={sfxEnabled ? 'Mute SFX' : 'Enable SFX'}
          className="w-7 h-7 rounded flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
        >
          {sfxEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={onToggleMusic}
          title={musicEnabled ? 'Mute Music' : 'Enable Music'}
          className="w-7 h-7 rounded flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
        >
          {musicEnabled ? '🎵' : '🎵'}
          <span className="sr-only">{musicEnabled ? 'Music on' : 'Music off'}</span>
        </button>
        {status === 'playing' && (
          <button
            onClick={onPause}
            title="Pause (ESC)"
            className="w-7 h-7 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors font-mono text-xs"
          >
            ⏸
          </button>
        )}
      </div>
    </div>
  );
}
