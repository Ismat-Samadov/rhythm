"use client";

import { memo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import Card from "@/components/ui/Card";
import { timeData } from "@/lib/data";

// Memoized custom tooltip for better performance
const CustomTooltip = memo(function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] p-3 backdrop-blur-xl">
      <p className="text-xs font-semibold text-[var(--color-text)] mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px] py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--color-text-secondary)]">{entry.name}</span>
          </div>
          <span className="font-semibold text-[var(--color-text)] tabular-nums">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});

export default function TimeTrends() {
  // Handle edge case: empty data
  if (!timeData || timeData.length === 0) {
    return (
      <Card title="Monthly Trends" subtitle="12-month application volume">
        <div className="h-60 sm:h-72 md:h-80 empty-state">
          <TrendingUp size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No trend data available</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Monthly Trends"
      subtitle="12-month application volume"
      role="img"
      ariaLabel="Area chart showing monthly trends of applications, telesales processed, online processed, sold, and rejected over 12 months"
    >
      <div className="h-56 sm:h-64 md:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <defs>
              <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
              iconType="circle"
              iconSize={6}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 10 }}>{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradApps)"
              name="Applications"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#6366f1' }}
            />
            <Area
              type="monotone"
              dataKey="telesalesProcessed"
              stroke="#8b5cf6"
              strokeWidth={1.5}
              fill="transparent"
              name="Telesales"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="onlineProcessed"
              stroke="#06b6d4"
              strokeWidth={1.5}
              fill="transparent"
              name="Online"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="sold"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradSold)"
              name="Sold"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#10b981' }}
            />
            <Area
              type="monotone"
              dataKey="rejected"
              stroke="#ef4444"
              strokeWidth={1}
              fill="transparent"
              name="Rejected"
              dot={false}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
