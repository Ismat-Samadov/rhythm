"use client";

import { useEffect, useRef, useState, memo } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

const AnimatedNumber = memo(function AnimatedNumber({
  value,
  duration = 1000,
  format,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const previousValue = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Handle edge case: invalid value
    if (typeof value !== 'number' || isNaN(value)) {
      setDisplay(0);
      return;
    }

    const start = performance.now();
    const from = previousValue.current;
    const to = value;

    // If values are the same, no animation needed
    if (from === to) {
      setDisplay(to);
      return;
    }

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        previousValue.current = to;
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);

  // Handle edge case: invalid display value
  const safeDisplay = isNaN(display) ? 0 : display;
  const formatted = format
    ? format(safeDisplay)
    : Math.round(safeDisplay).toLocaleString("en-US");

  return (
    <span className="tabular-nums" aria-live="polite" aria-atomic="true">
      {formatted}
    </span>
  );
});

export default AnimatedNumber;
