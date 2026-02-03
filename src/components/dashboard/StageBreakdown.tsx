"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { List, ArrowRight, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { funnelStages } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

const stageColors = [
  '#6366f1', '#7c3aed', '#8b5cf6', '#a855f7',
  '#6366f1', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#10b981', '#10b981',
];

const StageRow = memo(function StageRow({
  stage,
  index,
  maxCount,
}: {
  stage: typeof funnelStages[0];
  index: number;
  maxCount: number;
}) {
  // Handle edge case: zero or invalid values
  const safeMaxCount = maxCount > 0 ? maxCount : 1;
  const safeCount = stage.count >= 0 ? stage.count : 0;
  const widthPct = (safeCount / safeMaxCount) * 100;
  const color = stageColors[index] || '#6366f1';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), ease: [0.4, 0, 0.2, 1] }}
      className="group p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors"
      role="listitem"
      aria-label={`${stage.name}: ${formatNumber(safeCount)}${stage.dropoff > 0 ? `, ${stage.dropoff}% dropoff` : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 sm:mb-2 gap-1 sm:gap-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="text-[11px] sm:text-xs md:text-sm font-medium text-[var(--color-text)] truncate">
            {stage.name}
          </span>
          <ArrowRight size={10} className="text-[var(--color-text-muted)] hidden md:block shrink-0" aria-hidden="true" />
          <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] hidden md:block truncate">
            {stage.nameAz}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 pl-3.5 sm:pl-0">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[var(--color-text)] tabular-nums">
            {formatNumber(safeCount)}
          </span>
          {stage.dropoff > 0 && (
            <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] md:text-[11px] text-rose-500 dark:text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded-md">
              <TrendingDown size={10} aria-hidden="true" />
              <span>{stage.dropoff}%</span>
              <span className="sr-only">dropoff</span>
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 sm:h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(widthPct, 1)}%` }}
          transition={{ delay: Math.min(index * 0.04 + 0.15, 0.55), duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full transition-all group-hover:brightness-110"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
});

export default function StageBreakdown() {
  // Handle edge case: empty data
  if (!funnelStages || funnelStages.length === 0) {
    return (
      <Card title="Stage-by-Stage Breakdown" subtitle="Detailed conversion metrics per stage">
        <div className="empty-state py-8">
          <List size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No stage data available</span>
        </div>
      </Card>
    );
  }

  const maxCount = funnelStages[0]?.count ?? 0;

  return (
    <Card
      title="Stage-by-Stage Breakdown"
      subtitle="Detailed conversion metrics per stage"
      role="region"
      ariaLabel="Detailed breakdown of conversion stages"
    >
      <div className="space-y-1 sm:space-y-2" role="list">
        {funnelStages.map((stage, i) => (
          <StageRow key={stage.id} stage={stage} index={i} maxCount={maxCount} />
        ))}
      </div>
    </Card>
  );
}
