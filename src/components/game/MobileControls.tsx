'use client';

import { useRef } from 'react';
import { LANE_COLORS, LANE_KEYS } from '@/lib/constants';

interface MobileControlsProps {
  onPress: (lane: number) => void;
  onRelease: (lane: number) => void;
}

/**
 * Four full-height tap buttons for mobile play.
 * Uses pointer events for reliable multi-touch support.
 */
export function MobileControls({ onPress, onRelease }: MobileControlsProps) {
  // Track which pointer IDs are on which lane (for multi-touch)
  const pointerLaneRef = useRef<Map<number, number>>(new Map());

  const handlePointerDown = (e: React.PointerEvent, lane: number) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerLaneRef.current.set(e.pointerId, lane);
    onPress(lane);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    const lane = pointerLaneRef.current.get(e.pointerId);
    if (lane !== undefined) {
      pointerLaneRef.current.delete(e.pointerId);
      onRelease(lane);
    }
  };

  return (
    <div
      className="flex h-20 md:h-24 select-none touch-none"
      style={{ WebkitUserSelect: 'none' }}
    >
      {LANE_COLORS.map((color, i) => (
        <button
          key={i}
          onPointerDown={e => handlePointerDown(e, i)}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex-1 flex flex-col items-center justify-center gap-1 border-t-2 transition-all duration-75 active:brightness-125 cursor-pointer"
          style={{
            borderColor: color.base,
            background: `linear-gradient(to top, ${color.dark}, transparent)`,
          }}
        >
          {/* Key label */}
          <span
            className="font-mono text-base font-black leading-none"
            style={{ color: color.base, textShadow: `0 0 8px ${color.glow}` }}
          >
            {LANE_KEYS[i]}
          </span>
          {/* Small tap indicator */}
          <div
            className="w-8 h-1 rounded-full opacity-60"
            style={{ backgroundColor: color.base }}
          />
        </button>
      ))}
    </div>
  );
}
