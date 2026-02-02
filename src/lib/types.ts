export interface KpiData {
  label: string;
  value: number;
  format: 'number' | 'percent' | 'days';
  icon: string;
  color: string;
  change: number; // percent change from previous period
}

export interface FunnelStage {
  id: string;
  name: string;
  nameAz: string;
  count: number;
  dropoff: number; // percentage drop from previous
}

export interface SourceChannel {
  name: string;
  applications: number;
  telesalesConverted: number;
  onlineConverted: number;
  sold: number;
  rejected: number;
  color: string;
}

export interface TimeDataPoint {
  month: string;
  applications: number;
  telesalesProcessed: number;
  onlineProcessed: number;
  sold: number;
  rejected: number;
}

export interface SankeyNode {
  name: string;
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}
