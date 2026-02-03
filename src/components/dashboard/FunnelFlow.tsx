"use client";

import { useCallback, useState, useMemo, memo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { GitBranch } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

const FlowNode = memo(function FlowNode({ data }: NodeProps) {
  const [hovered, setHovered] = useState(false);

  const styles: Record<string, { bg: string; border: string; shadow: string }> = {
    source: { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: '#818cf8', shadow: 'rgba(99, 102, 241, 0.3)' },
    process: { bg: 'linear-gradient(135deg, #1e3a5f, #1e40af)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.2)' },
    decision: { bg: 'linear-gradient(135deg, #d97706, #b45309)', border: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.3)' },
    success: { bg: 'linear-gradient(135deg, #059669, #047857)', border: '#34d399', shadow: 'rgba(16, 185, 129, 0.3)' },
    reject: { bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', border: '#f87171', shadow: 'rgba(239, 68, 68, 0.3)' },
    entry: { bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: '#a78bfa', shadow: 'rgba(139, 92, 246, 0.3)' },
  };

  const s = styles[data?.type] || styles.process;
  const count = data?.count;
  const hasCount = count !== undefined && count !== null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative"
      role="button"
      tabIndex={0}
      aria-label={`${data?.label || 'Node'}${hasCount ? `: ${formatNumber(count)}` : ''}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-white/40 !w-1.5 !h-1.5 !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-white/40 !w-1.5 !h-1.5 !border-0" />
      <div
        className="px-3 sm:px-4 py-2 sm:py-3 text-white text-center transition-all duration-200"
        style={{
          background: s.bg,
          minWidth: 100,
          maxWidth: 160,
          borderRadius: 12,
          border: `1.5px solid ${hovered ? s.border : 'rgba(255,255,255,0.15)'}`,
          boxShadow: hovered
            ? `0 0 24px ${s.shadow}, 0 4px 16px rgba(0,0,0,0.2)`
            : '0 2px 8px rgba(0,0,0,0.15)',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
        }}
      >
        <div className="text-[10px] sm:text-[11px] font-semibold leading-tight truncate">
          {data?.label || 'Unknown'}
        </div>
        {data?.labelAz && (
          <div className="text-[8px] sm:text-[9px] opacity-70 mt-0.5 font-medium truncate">
            {data.labelAz}
          </div>
        )}
        {hasCount && (
          <div className="text-[12px] sm:text-[13px] font-bold mt-1 sm:mt-1.5 tracking-tight">
            {formatNumber(count)}
          </div>
        )}
      </div>
      {hovered && data?.tooltip && (
        <div
          className="absolute -top-10 sm:-top-11 left-1/2 -translate-x-1/2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text)] text-[9px] sm:text-[10px] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none"
          role="tooltip"
        >
          {data.tooltip}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-white/40 !w-1.5 !h-1.5 !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-white/40 !w-1.5 !h-1.5 !border-0" />
    </div>
  );
});

const nodeTypes = { flowNode: FlowNode };

const initialNodes: Node[] = [
  { id: 'entry', position: { x: 400, y: 0 }, data: { label: 'Applications Received', labelAz: 'Müraciətlər daxil olur', count: 12450, type: 'entry', tooltip: '100% — All incoming applications' }, type: 'flowNode' },
  { id: 'dostbank', position: { x: 30, y: 100 }, data: { label: 'Dostbank', count: 3200, type: 'source', tooltip: '25.7% of applications' }, type: 'flowNode' },
  { id: 'bolkart', position: { x: 210, y: 100 }, data: { label: 'bolkart.az', count: 2800, type: 'source', tooltip: '22.5% of applications' }, type: 'flowNode' },
  { id: 'bankofbaku', position: { x: 390, y: 100 }, data: { label: 'bankofbaku.com', count: 2100, type: 'source', tooltip: '16.9% of applications' }, type: 'flowNode' },
  { id: 'callcenter', position: { x: 580, y: 100 }, data: { label: '145 Call Center', count: 1950, type: 'source', tooltip: '15.7% of applications' }, type: 'flowNode' },
  { id: 'social', position: { x: 770, y: 100 }, data: { label: 'Social Media', count: 2400, type: 'source', tooltip: '19.3% of applications' }, type: 'flowNode' },
  { id: 'telesales', position: { x: 400, y: 230 }, data: { label: 'Telesales Pool', labelAz: 'Hovuz (Telesatış)', count: 12450, type: 'process', tooltip: 'All applications enter telesales' }, type: 'flowNode' },
  { id: 'tele_call', position: { x: 400, y: 350 }, data: { label: 'Rep Calls Customer', labelAz: 'Müştəriyə zəng edir', count: 10350, type: 'process', tooltip: 'Telesales rep clicks Next and calls' }, type: 'flowNode' },
  { id: 'call_result', position: { x: 400, y: 470 }, data: { label: 'Call Result', labelAz: 'Müraciət emal edilir', count: 10350, type: 'decision', tooltip: 'Application processed after call' }, type: 'flowNode' },
  { id: 'unreachable', position: { x: 720, y: 470 }, data: { label: 'Unreachable', labelAz: 'Zəng çatmır', count: 2100, type: 'reject', tooltip: 'Re-added to pool after few days' }, type: 'flowNode' },
  { id: 'tele_reject', position: { x: 720, y: 350 }, data: { label: 'Rejected', labelAz: 'İmtina', count: 2150, type: 'reject', tooltip: 'Rejected at telesales stage' }, type: 'flowNode' },
  { id: 'scoring', position: { x: 100, y: 420 }, data: { label: 'Scoring Stage', labelAz: 'Scoring mərhələsi', count: 8200, type: 'process', tooltip: 'Credit scoring evaluation' }, type: 'flowNode' },
  { id: 'online_pool', position: { x: 180, y: 560 }, data: { label: 'Online Pool', labelAz: 'Hovuz (Online)', count: 7500, type: 'process', tooltip: 'After scoring completion' }, type: 'flowNode' },
  { id: 'online_call', position: { x: 180, y: 670 }, data: { label: 'Online Rep Calls', labelAz: 'Online zəng edir', count: 6800, type: 'process', tooltip: 'Online rep clicks Next and calls' }, type: 'flowNode' },
  { id: 'analysis', position: { x: 180, y: 780 }, data: { label: 'Credit Analysis', labelAz: 'Kredit təhlili', count: 6200, type: 'decision', tooltip: 'Online credit department analyzes' }, type: 'flowNode' },
  { id: 'kbd', position: { x: 460, y: 830 }, data: { label: 'KBD', count: 1500, type: 'process', tooltip: 'No job / KBD eligible cases' }, type: 'flowNode' },
  { id: 'branch_sale', position: { x: 30, y: 930 }, data: { label: 'Branch Sale', labelAz: 'Filialda satış', count: 2500, type: 'success', tooltip: 'Sold at physical branch' }, type: 'flowNode' },
  { id: 'online_sale', position: { x: 230, y: 930 }, data: { label: 'Online Sale', labelAz: 'Online satış', count: 1700, type: 'success', tooltip: 'Sold through online channel' }, type: 'flowNode' },
  { id: 'final_reject', position: { x: 500, y: 930 }, data: { label: 'Rejected', labelAz: 'İmtina edilir', count: 1800, type: 'reject', tooltip: 'Final rejection after analysis' }, type: 'flowNode' },
];

const labelBgStyle = { fill: 'var(--color-surface)', fillOpacity: 0.95, rx: 4, ry: 4 };

const initialEdges: Edge[] = [
  { id: 'e-entry-ts', source: 'entry', target: 'telesales', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-dost-ts', source: 'dostbank', target: 'telesales', style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.6 } },
  { id: 'e-bol-ts', source: 'bolkart', target: 'telesales', style: { stroke: '#8b5cf6', strokeWidth: 1.5, opacity: 0.6 } },
  { id: 'e-bob-ts', source: 'bankofbaku', target: 'telesales', style: { stroke: '#06b6d4', strokeWidth: 1.5, opacity: 0.6 } },
  { id: 'e-cc-ts', source: 'callcenter', target: 'telesales', style: { stroke: '#f97316', strokeWidth: 1.5, opacity: 0.6 } },
  { id: 'e-soc-ts', source: 'social', target: 'telesales', style: { stroke: '#ec4899', strokeWidth: 1.5, opacity: 0.6 } },
  { id: 'e-ts-call', source: 'telesales', target: 'tele_call', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-call-result', source: 'tele_call', target: 'call_result', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e-result-unreach', source: 'call_result', sourceHandle: 'right', target: 'unreachable', targetHandle: 'left', label: '2,100', style: { stroke: '#f59e0b' }, labelStyle: { fontSize: 9, fill: '#f59e0b', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-result-reject', source: 'tele_call', sourceHandle: 'right', target: 'tele_reject', targetHandle: 'left', label: '2,150', style: { stroke: '#ef4444' }, labelStyle: { fontSize: 9, fill: '#ef4444', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-result-scoring', source: 'call_result', target: 'scoring', label: '8,200', style: { stroke: '#10b981' }, labelStyle: { fontSize: 9, fill: '#10b981', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-score-online', source: 'scoring', target: 'online_pool', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 }, label: '7,500', labelStyle: { fontSize: 9, fill: '#3b82f6', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-op-call', source: 'online_pool', target: 'online_call', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
  { id: 'e-oc-analysis', source: 'online_call', target: 'analysis', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
  { id: 'e-analysis-branch', source: 'analysis', target: 'branch_sale', label: '2,500', style: { stroke: '#10b981' }, labelStyle: { fontSize: 9, fill: '#10b981', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-analysis-online', source: 'analysis', target: 'online_sale', label: '1,700', style: { stroke: '#10b981' }, labelStyle: { fontSize: 9, fill: '#10b981', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-analysis-kbd', source: 'analysis', sourceHandle: 'right', target: 'kbd', targetHandle: 'left', label: '1,500', style: { stroke: '#f59e0b' }, labelStyle: { fontSize: 9, fill: '#f59e0b', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-analysis-reject', source: 'analysis', sourceHandle: 'right', target: 'final_reject', label: '1,800', style: { stroke: '#ef4444' }, labelStyle: { fontSize: 9, fill: '#ef4444', fontWeight: 600 }, labelBgStyle, labelBgPadding: [4, 2] as [number, number] },
  { id: 'e-kbd-reject', source: 'kbd', target: 'final_reject', style: { stroke: '#ef4444', strokeWidth: 1, opacity: 0.5 } },
  { id: 'e-unreach-ts', source: 'unreachable', sourceHandle: 'right', target: 'telesales', targetHandle: 'right', label: 'Re-queue', style: { stroke: '#f59e0b', strokeDasharray: '5 5' }, labelStyle: { fontSize: 8, fill: '#f59e0b' }, labelBgStyle, labelBgPadding: [4, 2] as [number, number], type: 'smoothstep' },
];

function FlowInner() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(prev => prev === node.id ? null : node.id);
  }, []);

  const edgesWithHighlight = useMemo(() => initialEdges.map(edge => {
    if (!selectedNode) return edge;
    const isConnected = edge.source === selectedNode || edge.target === selectedNode;
    return {
      ...edge,
      style: { ...edge.style, opacity: isConnected ? 1 : 0.1, strokeWidth: isConnected ? 3 : 1 },
    };
  }), [selectedNode]);

  const nodesWithHighlight = useMemo(() => initialNodes.map(node => ({
    ...node,
    style: { opacity: selectedNode && selectedNode !== node.id ? 0.35 : 1, transition: 'opacity 0.25s ease' },
  })), [selectedNode]);

  return (
    <ReactFlow
      nodes={nodesWithHighlight}
      edges={edgesWithHighlight}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={() => setSelectedNode(null)}
      fitView
      fitViewOptions={{ padding: 0.12 }}
      minZoom={0.25}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="var(--color-border)" gap={24} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={(n) => {
          const type = n.data?.type;
          if (type === 'success') return '#10b981';
          if (type === 'reject') return '#ef4444';
          if (type === 'source') return '#6366f1';
          if (type === 'decision') return '#f59e0b';
          return '#3b82f6';
        }}
        className="!bg-[var(--color-surface)] !border-[var(--color-border)]"
        style={{ borderRadius: 12 }}
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

export default function FunnelFlow() {
  // Handle edge case: empty nodes
  if (!initialNodes || initialNodes.length === 0) {
    return (
      <Card title="Interactive Process Flow" subtitle="Click a node to highlight connections" className="lg:col-span-2">
        <div className="h-[400px] sm:h-[500px] md:h-[650px] empty-state">
          <GitBranch size={32} className="mb-3 opacity-50" />
          <span className="text-sm text-[var(--color-text-muted)]">No flow data available</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Interactive Process Flow"
      subtitle="Click a node to highlight connections"
      className="lg:col-span-2"
      noPadding
      role="img"
      ariaLabel="Interactive flow diagram showing the application process from receipt through various stages to final outcomes"
    >
      <div className="h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] rounded-b-xl sm:rounded-b-2xl overflow-hidden">
        <ReactFlowProvider>
          <FlowInner />
        </ReactFlowProvider>
      </div>
    </Card>
  );
}
