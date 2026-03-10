'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

/** Glassmorphism pause overlay */
export function PauseMenu({ onResume, onRestart, onMenu }: PauseMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center z-30 bg-void-900/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-72 rounded-2xl border border-white/10 bg-void-800/80 backdrop-blur-xl p-8 text-center shadow-2xl"
      >
        {/* Title */}
        <h2 className="font-display text-3xl font-black text-white mb-1 tracking-widest">
          PAUSED
        </h2>
        <p className="font-mono text-white/30 text-xs mb-8 tracking-widest">
          Take a breath.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="md" onClick={onResume} className="w-full">
            ▶ Resume
          </Button>
          <Button variant="secondary" size="md" onClick={onRestart} className="w-full">
            ↺ Restart
          </Button>
          <Button variant="ghost" size="md" onClick={onMenu} className="w-full">
            ⬡ Menu
          </Button>
        </div>

        {/* Keyboard hint */}
        <p className="font-mono text-white/20 text-[10px] mt-6 tracking-widest">
          Press ESC or P to resume
        </p>
      </motion.div>
    </motion.div>
  );
}
