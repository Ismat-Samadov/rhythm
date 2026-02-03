"use client";

import { Activity, BarChart3 } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-surface)]/80 border-b border-[var(--color-border)]"
      role="banner"
    >
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="relative" aria-hidden="true">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BarChart3 size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-[var(--color-surface)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-[var(--color-text)] tracking-tight truncate">
              Cash Loan Funnel
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] font-medium truncate">
              Nağd pul krediti analizi
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 sm:gap-4"
        >
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <Activity size={12} className="text-emerald-400" aria-hidden="true" />
            <span className="text-[10px] sm:text-[11px] text-[var(--color-text-secondary)] font-medium">
              Live
            </span>
            <span className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] hidden md:inline">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <ThemeToggle />
        </motion.div>
      </div>
    </header>
  );
}
