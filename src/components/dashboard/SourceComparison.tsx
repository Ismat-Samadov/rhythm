"use client";

import { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";
import Card from "@/components/ui/Card";
import { sourceChannels } from "@/lib/data";

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

export default function SourceComparison() {
  // Handle edge case: empty data
  if (!sourceChannels || sourceChannels.length === 0) {
    return (
      <Card title="Source Channels" subtitle="Performance by acquisition channel">
        <div className="h-60 sm:h-72 md:h-80 empty-state">
          <BarChart3 size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No channel data available</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Source Channels"
      subtitle="Performance by acquisition channel"
      role="img"
      ariaLabel="Bar chart showing performance metrics across different acquisition channels including applications, telesales, online conversions, and sales"
    >
      <div className="h-56 sm:h-64 md:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sourceChannels}
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            barCategoryGap="15%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={40}
            />
            <YAxis
              tick={{ fontSize: 9, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--color-surface-hover)', radius: 8 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-secondary)', fontSize: 10 }}>{value}</span>
              )}
            />
            <Bar dataKey="applications" fill="#6366f1" name="Applications" radius={[3, 3, 0, 0]} />
            <Bar dataKey="telesalesConverted" fill="#8b5cf6" name="Telesales" radius={[3, 3, 0, 0]} />
            <Bar dataKey="onlineConverted" fill="#06b6d4" name="Online" radius={[3, 3, 0, 0]} />
            <Bar dataKey="sold" fill="#10b981" name="Sold" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
