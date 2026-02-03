"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Show placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]" />
    );
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 sm:p-2.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 transition-all duration-200"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      type="button"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400" aria-hidden="true" />
          ) : (
            <Moon size={18} className="text-indigo-500" aria-hidden="true" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">
        {isDark ? "Currently dark theme" : "Currently light theme"}
      </span>
    </motion.button>
  );
}
