"use client";

import { useState } from "react";
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from "recharts";
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

function SankeyNode({ x, y, width, height, index, payload }: any) {
  const color = NODE_COLORS[payload.name] || '#6366f1';
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
      >
        {payload.name}
      </text>
    </Layer>
  );
}

function SankeyLink({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload }: any) {
  const sourceColor = NODE_COLORS[payload.source?.name] || '#6366f1';
  const targetColor = NODE_COLORS[payload.target?.name] || '#6366f1';
  const isReject = payload.target?.name === 'Rejected' || payload.target?.name === 'Unreachable' || payload.target?.name === 'Not Suitable';
  const color = isReject ? '#ef4444' : sourceColor;

  return (
    <Layer>
      <defs>
        <linearGradient id={`link-grad-${payload.source?.name}-${payload.target?.name}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={sourceColor} stopOpacity={0.2} />
          <stop offset="100%" stopColor={targetColor} stopOpacity={0.2} />
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
        fill={`url(#link-grad-${payload.source?.name}-${payload.target?.name})`}
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={0.5}
        className="transition-opacity hover:!opacity-80"
      />
    </Layer>
  );
}

export default function SankeyChart() {
  const data = { nodes: sankeyNodes, links: sankeyLinks };

  return (
    <Card title="Flow Visualization" subtitle="Volume distribution across all stages">
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            nodeWidth={8}
            nodePadding={20}
            margin={{ top: 10, right: 160, bottom: 10, left: 10 }}
            link={<SankeyLink />}
            node={<SankeyNode />}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                fontSize: 11,
                boxShadow: 'var(--shadow-lg)',
              }}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
