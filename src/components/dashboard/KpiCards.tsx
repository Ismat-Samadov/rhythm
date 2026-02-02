"use client";

import { motion } from "framer-motion";
import { FileText, TrendingUp, XCircle, Clock, Phone, Globe, LucideIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { kpiData } from "@/lib/data";
import { formatPercent, formatDays, formatNumber } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FileText, TrendingUp, XCircle, Clock, Phone, Globe,
};

export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {kpiData.map((kpi, i) => {
        const Icon = iconMap[kpi.icon] || FileText;
        const formatter = kpi.format === 'percent'
          ? (n: number) => formatPercent(n)
          : kpi.format === 'days'
            ? (n: number) => formatDays(n)
            : (n: number) => formatNumber(Math.round(n));

        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ y: -3 }}
            className="card-glow bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl sm:rounded-2xl p-3 sm:p-4 cursor-default relative z-10 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${kpi.color}15` }}
              >
                <Icon size={17} style={{ color: kpi.color }} strokeWidth={2} />
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                kpi.change > 0
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'text-red-600 dark:text-red-400 bg-red-500/10'
              }`}>
                {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change)}%
              </div>
            </div>
            <div className="text-lg sm:text-[22px] font-bold text-[var(--color-text)] tracking-tight leading-none">
              <AnimatedNumber value={kpi.value} format={formatter} />
            </div>
            <div className="text-[11px] text-[var(--color-text-muted)] mt-1.5 font-medium">{kpi.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
