'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface CountdownOverlayProps {
  count: number;
}

/** Full-screen countdown (3 → 2 → 1 → GO!) shown before the game starts */
export function CountdownOverlay({ count }: CountdownOverlayProps) {
  const label = count > 0 ? String(count) : 'GO!';
  const color = count > 0 ? '#00f5ff' : '#ffd700';

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={label}
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="font-display font-black text-center"
          style={{
            fontSize: 'clamp(4rem, 20vw, 10rem)',
            color,
            textShadow: `0 0 30px ${color}, 0 0 60px ${color}60`,
          }}
        >
          {label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
