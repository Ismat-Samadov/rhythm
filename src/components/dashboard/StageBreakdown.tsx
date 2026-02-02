"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { funnelStages } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { ArrowRight, TrendingDown } from "lucide-react";

const stageColors = [
  '#6366f1', '#7c3aed', '#8b5cf6', '#a855f7',
  '#6366f1', '#06b6d4', '#0ea5e9', '#3b82f6',
  '#10b981', '#10b981',
];

export default function StageBreakdown() {
  const maxCount = funnelStages[0].count;

  return (
    <Card title="Stage-by-Stage Breakdown" subtitle="Detailed conversion metrics per stage">
      <div className="space-y-2">
        {funnelStages.map((stage, i) => {
          const widthPct = (stage.count / maxCount) * 100;
          const color = stageColors[i] || '#6366f1';
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, ease: [0.4, 0, 0.2, 1] }}
              className="group p-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-0">
                <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs sm:text-sm font-medium text-[var(--color-text)] truncate">{stage.name}</span>
                  <ArrowRight size={10} className="text-[var(--color-text-muted)] hidden sm:block shrink-0" />
                  <span className="text-xs text-[var(--color-text-muted)] hidden sm:block truncate">{stage.nameAz}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 pl-3.5 sm:pl-0">
                  <span className="text-xs sm:text-sm font-bold text-[var(--color-text)] tabular-nums">{formatNumber(stage.count)}</span>
                  {stage.dropoff > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-red-400 font-semibold bg-red-500/10 px-1.5 py-0.5 rounded-md">
                      <TrendingDown size={10} />
                      {stage.dropoff}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-[var(--color-surface-hover)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ delay: i * 0.04 + 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full transition-all group-hover:brightness-110"
                  style={{ backgroundColor: color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
