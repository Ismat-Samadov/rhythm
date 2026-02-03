"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, TrendingUp, XCircle, Clock, Phone, Globe, LucideIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { kpiData } from "@/lib/data";
import { formatPercent, formatDays, formatNumber } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileText, TrendingUp, XCircle, Clock, Phone, Globe,
};

const KpiCard = memo(function KpiCard({
  kpi,
  index,
}: {
  kpi: typeof kpiData[0];
  index: number;
}) {
  const Icon = iconMap[kpi.icon] || FileText;

  const formatter = useMemo(() => {
    if (kpi.format === 'percent') return (n: number) => formatPercent(n);
    if (kpi.format === 'days') return (n: number) => formatDays(n);
    return (n: number) => formatNumber(Math.round(n));
  }, [kpi.format]);

  // Handle edge case: no value
  if (kpi.value === undefined || kpi.value === null) {
    return (
      <div className="card-glow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <div className="empty-state">
          <span className="text-xs">No data</span>
        </div>
      </div>
    );
  }

  const isPositive = kpi.change > 0;
  const changeText = isPositive ? "increased" : "decreased";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3 }}
      className="card-glow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-default relative z-10 group"
      role="article"
      aria-label={`${kpi.label}: ${formatter(kpi.value)}, ${changeText} by ${Math.abs(kpi.change)}%`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${kpi.color}20` }}
          aria-hidden="true"
        >
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" style={{ color: kpi.color }} strokeWidth={2} />
        </div>
        <div
          className={`flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
              : 'text-rose-600 dark:text-rose-400 bg-rose-500/10'
          }`}
          aria-label={`${changeText} ${Math.abs(kpi.change)}%`}
        >
          <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(kpi.change)}%</span>
        </div>
      </div>
      <div className="text-base sm:text-lg md:text-[22px] font-bold text-[var(--color-text)] tracking-tight leading-none">
        <AnimatedNumber value={kpi.value} format={formatter} />
      </div>
      <div className="text-[10px] sm:text-[11px] text-[var(--color-text-muted)] mt-1 sm:mt-1.5 font-medium truncate">
        {kpi.label}
      </div>
    </motion.div>
  );
});

export default function KpiCards() {
  // Handle edge case: empty data
  if (!kpiData || kpiData.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-6">
        <div className="empty-state">
          <FileText size={24} className="mb-2 opacity-50" />
          <span className="text-sm">No KPI data available</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
      role="region"
      aria-label="Key Performance Indicators"
    >
      {kpiData.map((kpi, i) => (
        <KpiCard key={kpi.label} kpi={kpi} index={i} />
      ))}
    </div>
  );
}
