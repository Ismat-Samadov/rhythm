"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import { sourceChannels } from "@/lib/data";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] p-3 backdrop-blur-xl">
      <p className="text-xs font-semibold text-[var(--color-text)] mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px] py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--color-text-secondary)]">{entry.name}</span>
          </div>
          <span className="font-semibold text-[var(--color-text)] tabular-nums">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function SourceComparison() {
  return (
    <Card title="Source Channels" subtitle="Performance by acquisition channel">
      <div className="h-60 sm:h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sourceChannels} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-hover)', radius: 8 }} />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: 'var(--color-text-secondary)', fontSize: 11 }}>{value}</span>}
            />
            <Bar dataKey="applications" fill="#6366f1" name="Applications" radius={[4, 4, 0, 0]} />
            <Bar dataKey="telesalesConverted" fill="#8b5cf6" name="Telesales" radius={[4, 4, 0, 0]} />
            <Bar dataKey="onlineConverted" fill="#06b6d4" name="Online" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sold" fill="#10b981" name="Sold" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
