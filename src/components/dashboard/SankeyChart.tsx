"use client";

import { memo, useRef, useEffect, useState } from "react";
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from "recharts";
import { GitBranch, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { sankeyNodes, sankeyLinks } from "@/lib/data";

const NODE_COLORS: Record<string, string> = {
  'Dostbank': '#6366f1',
  'bolkart.az': '#8b5cf6',
  'bankofbaku.com': '#06b6d4',
  '145 Call Center': '#f97316',
  'Social Media': '#ec4899',
  'Telesales Pool': '#6366f1',
  'Successful Calls': '#10b981',
  'Unreachable': '#f59e0b',
  'Scoring': '#3b82f6',
  'Online Pool': '#0ea5e9',
  'Approved': '#10b981',
  'Not Suitable': '#ef4444',
  'KBD': '#f59e0b',
  'Branch Sales': '#10b981',
  'Online Sales': '#10b981',
  'Rejected': '#ef4444',
};

const SankeyNode = memo(function SankeyNode({ x, y, width, height, index, payload }: any) {
  const color = NODE_COLORS[payload?.name] || '#6366f1';

  return (
    <Layer key={`node-${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={0.85}
        rx={4}
        ry={4}
      />
      <text
        x={x + width + 8}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={10}
        fontWeight={500}
        fill="var(--color-text-secondary)"
        className="select-none"
      >
        {payload?.name || ''}
      </text>
    </Layer>
  );
});

const SankeyLink = memo(function SankeyLink({
  sourceX,
  targetX,
  sourceY,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  payload,
}: any) {
  const sourceColor = NODE_COLORS[payload?.source?.name] || '#6366f1';
  const targetColor = NODE_COLORS[payload?.target?.name] || '#6366f1';
  const isReject = payload?.target?.name === 'Rejected' ||
    payload?.target?.name === 'Unreachable' ||
    payload?.target?.name === 'Not Suitable';
  const gradientId = `link-grad-${payload?.source?.name || 'src'}-${payload?.target?.name || 'tgt'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Layer>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={sourceColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={targetColor} stopOpacity={0.25} />
        </linearGradient>
      </defs>
      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        fill={`url(#${gradientId})`}
        stroke={isReject ? '#ef4444' : sourceColor}
        strokeOpacity={0.2}
        strokeWidth={0.5}
        className="transition-opacity hover:!opacity-80"
      />
    </Layer>
  );
});

// Memoized tooltip
const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-lg)] p-3 backdrop-blur-xl">
      <p className="text-xs font-semibold text-[var(--color-text)] mb-1">
        {data.source?.name || data.name} → {data.target?.name || ''}
      </p>
      {data.value !== undefined && (
        <p className="text-[11px] text-[var(--color-text-secondary)]">
          Volume: <span className="font-semibold text-[var(--color-text)]">{data.value.toLocaleString()}</span>
        </p>
      )}
    </div>
  );
});

export default function SankeyChart() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  // Check if content overflows and needs scroll indicator
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setHasScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Handle edge case: empty data
  if (!sankeyNodes || sankeyNodes.length === 0 || !sankeyLinks || sankeyLinks.length === 0) {
    return (
      <Card title="Flow Visualization" subtitle="Volume distribution across all stages">
        <div className="h-[300px] sm:h-[400px] md:h-[500px] empty-state">
          <GitBranch size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No flow data available</span>
        </div>
      </Card>
    );
  }

  const data = { nodes: sankeyNodes, links: sankeyLinks };

  return (
    <Card
      title="Flow Visualization"
      subtitle="Volume distribution across all stages"
      role="img"
      ariaLabel="Sankey diagram showing volume flow from source channels through processing stages to final outcomes"
    >
      <div className="relative">
        {hasScroll && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-surface)] to-transparent z-10 pointer-events-none flex items-center justify-end pr-2">
            <ChevronRight size={16} className="text-[var(--color-text-muted)] animate-pulse" />
          </div>
        )}
        <div
          ref={scrollRef}
          className="h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] overflow-x-auto scrollbar-thin"
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={480}>
            <Sankey
              data={data}
              nodeWidth={8}
              nodePadding={14}
              margin={{ top: 10, right: 100, bottom: 10, left: 10 }}
              link={<SankeyLink />}
              node={<SankeyNode />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
