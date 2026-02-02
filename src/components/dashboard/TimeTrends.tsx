"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/ui/Card";
import { timeData } from "@/lib/data";

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

export default function TimeTrends() {
  return (
    <Card title="Monthly Trends" subtitle="12-month application volume">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradApps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={2} fill="url(#gradApps)" name="Applications" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#6366f1' }} />
            <Area type="monotone" dataKey="telesalesProcessed" stroke="#8b5cf6" strokeWidth={1.5} fill="transparent" name="Telesales" dot={false} />
            <Area type="monotone" dataKey="onlineProcessed" stroke="#06b6d4" strokeWidth={1.5} fill="transparent" name="Online" dot={false} />
            <Area type="monotone" dataKey="sold" stroke="#10b981" strokeWidth={2} fill="url(#gradSold)" name="Sold" dot={false} activeDot={{ r: 4, strokeWidth: 2, fill: '#10b981' }} />
            <Area type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={1} fill="transparent" name="Rejected" dot={false} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
