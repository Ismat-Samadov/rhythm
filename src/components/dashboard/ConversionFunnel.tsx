"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

const stages = [
  { label: "Applications", nameAz: "Müraciətlər", count: 12450, color: "#6366f1", gradient: "from-indigo-500 to-indigo-600" },
  { label: "Telesales Success", nameAz: "Telesatış uğuru", count: 8200, color: "#8b5cf6", gradient: "from-violet-500 to-violet-600" },
  { label: "Scoring Passed", nameAz: "Scoring keçdi", count: 7500, color: "#a855f7", gradient: "from-purple-500 to-purple-600" },
  { label: "Online Qualified", nameAz: "Online uyğun", count: 6200, color: "#06b6d4", gradient: "from-cyan-500 to-cyan-600" },
  { label: "Credit Approved", nameAz: "Kredit təsdiqləndi", count: 4200, color: "#0ea5e9", gradient: "from-sky-500 to-sky-600" },
  { label: "Final Sales", nameAz: "Son satış", count: 4200, color: "#10b981", gradient: "from-emerald-500 to-emerald-600" },
];

const FunnelStage = memo(function FunnelStage({
  stage,
  index,
  maxCount,
}: {
  stage: typeof stages[0];
  index: number;
  maxCount: number;
}) {
  // Handle edge case: zero or invalid values
  const safeMaxCount = maxCount > 0 ? maxCount : 1;
  const safeCount = stage.count >= 0 ? stage.count : 0;
  const widthPct = (safeCount / safeMaxCount) * 100;
  const pctOfTotal = ((safeCount / safeMaxCount) * 100).toFixed(1);

  const prevStage = index > 0 ? stages[index - 1] : null;
  const dropPct = prevStage && prevStage.count > 0
    ? ((1 - safeCount / prevStage.count) * 100).toFixed(0)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group cursor-default"
      role="listitem"
      aria-label={`${stage.label}: ${formatNumber(safeCount)}, ${pctOfTotal}% of total`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <div className="flex items-center justify-between sm:block sm:w-36 md:w-40 shrink-0 sm:text-right sm:pr-2">
          <div className="text-[11px] sm:text-xs md:text-sm font-semibold text-[var(--color-text)] truncate max-w-[120px] sm:max-w-none">
            {stage.label}
          </div>
          <div className="flex items-center gap-2 sm:block">
            <span className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] hidden sm:block truncate">
              {stage.nameAz}
            </span>
            <span className="text-[11px] sm:text-xs font-bold sm:hidden" style={{ color: stage.color }}>
              {pctOfTotal}%
            </span>
          </div>
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="h-9 sm:h-10 md:h-11 bg-[var(--color-surface-hover)] rounded-lg sm:rounded-xl overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(widthPct, 2)}%` }}
              transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="h-full rounded-lg sm:rounded-xl flex items-center px-2 sm:px-3 md:px-4 group-hover:brightness-110 transition-all relative overflow-hidden"
              style={{ backgroundColor: stage.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              <span className="text-white text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap relative z-10 drop-shadow-sm">
                {formatNumber(safeCount)}
              </span>
            </motion.div>
          </div>
        </div>
        <div className="hidden sm:block w-16 md:w-20 text-right shrink-0">
          <span className="text-xs md:text-sm font-bold" style={{ color: stage.color }}>
            {pctOfTotal}%
          </span>
          {dropPct && Number(dropPct) > 0 && (
            <div className="text-[9px] md:text-[10px] text-rose-500 dark:text-rose-400 font-medium">
              -{dropPct}% drop
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default function ConversionFunnel() {
  // Handle edge case: empty stages
  if (!stages || stages.length === 0) {
    return (
      <Card title="Conversion Funnel" subtitle="Application to sale pipeline">
        <div className="empty-state py-8">
          <BarChart3 size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No funnel data available</span>
        </div>
      </Card>
    );
  }

  const maxCount = stages[0]?.count ?? 0;

  return (
    <Card
      title="Conversion Funnel"
      subtitle="Application to sale pipeline"
      role="region"
      ariaLabel="Conversion funnel chart showing application progression"
    >
      <div className="space-y-2 sm:space-y-3" role="list">
        {stages.map((stage, i) => (
          <FunnelStage key={stage.label} stage={stage} index={i} maxCount={maxCount} />
        ))}
      </div>
    </Card>
  );
}
