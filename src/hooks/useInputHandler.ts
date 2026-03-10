'use client';

import { useEffect } from 'react';
import { LANE_KEY_CODES } from '@/lib/constants';
import type { GameStatus } from '@/lib/types';

interface UseInputHandlerOptions {
  status: GameStatus;
  pressLane: (lane: number) => void;
  releaseLane: (lane: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

/**
 * Registers keyboard event listeners for lane presses (A/S/D/F)
 * and the pause key (Escape / P).
 * Automatically cleans up on unmount.
 */
export function useInputHandler({
  status,
  pressLane,
  releaseLane,
  pauseGame,
  resumeGame,
}: UseInputHandlerOptions) {
  useEffect(() => {
    // Track held keys to prevent key-repeat from triggering multiple hits
    const heldKeys = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      if (heldKeys.has(e.code)) return; // ignore key repeat
      heldKeys.add(e.code);

      // Lane keys
      const laneIndex = LANE_KEY_CODES.indexOf(e.code);
      if (laneIndex !== -1) {
        e.preventDefault();
        pressLane(laneIndex);
        return;
      }

      // Pause / resume
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (status === 'playing') pauseGame();
        else if (status === 'paused') resumeGame();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.code);
      const laneIndex = LANE_KEY_CODES.indexOf(e.code);
      if (laneIndex !== -1) {
        releaseLane(laneIndex);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [status, pressLane, releaseLane, pauseGame, resumeGame]);
}
