"use client";

import { motion } from "framer-motion";
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

export default function ConversionFunnel() {
  const maxCount = stages[0].count;

  return (
    <Card title="Conversion Funnel" subtitle="Application to sale pipeline">
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const widthPct = (stage.count / maxCount) * 100;
          const pctOfTotal = ((stage.count / maxCount) * 100).toFixed(1);
          const dropPct = i > 0 ? ((1 - stage.count / stages[i - 1].count) * 100).toFixed(0) : null;

          return (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="group cursor-default"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <div className="flex items-center justify-between sm:block sm:w-40 shrink-0 sm:text-right sm:pr-2">
                  <div className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">{stage.label}</div>
                  <div className="flex items-center gap-2 sm:block">
                    <span className="text-[11px] text-[var(--color-text-muted)] hidden sm:block">{stage.nameAz}</span>
                    <span className="text-xs font-bold sm:hidden" style={{ color: stage.color }}>{pctOfTotal}%</span>
                  </div>
                </div>
                <div className="flex-1 relative">
                  <div className="h-8 sm:h-11 bg-[var(--color-surface-hover)] rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-xl flex items-center px-2 sm:px-4 group-hover:brightness-110 transition-all relative overflow-hidden"
                      style={{ backgroundColor: stage.color }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                      <span className="text-white text-xs sm:text-sm font-bold whitespace-nowrap relative z-10 drop-shadow-sm">
                        {formatNumber(stage.count)}
                      </span>
                    </motion.div>
                  </div>
                </div>
                <div className="hidden sm:block w-20 text-right shrink-0">
                  <span className="text-sm font-bold" style={{ color: stage.color }}>{pctOfTotal}%</span>
                  {dropPct && (
                    <div className="text-[10px] text-red-400 font-medium">-{dropPct}% drop</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
