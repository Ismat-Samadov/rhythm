import { KpiData, FunnelStage, SourceChannel, TimeDataPoint, SankeyNode, SankeyLink } from './types';

export const kpiData: KpiData[] = [
  { label: 'Total Applications', value: 12450, format: 'number', icon: 'FileText', color: '#3b82f6', change: 12.5 },
  { label: 'Conversion Rate', value: 33.7, format: 'percent', icon: 'TrendingUp', color: '#22c55e', change: 2.1 },
  { label: 'Rejection Rate', value: 14.5, format: 'percent', icon: 'XCircle', color: '#ef4444', change: -1.8 },
  { label: 'Avg Processing', value: 4.2, format: 'days', icon: 'Clock', color: '#f59e0b', change: -0.5 },
  { label: 'Telesales Success', value: 65.9, format: 'percent', icon: 'Phone', color: '#8b5cf6', change: 3.2 },
  { label: 'Online Sales Rate', value: 56.0, format: 'percent', icon: 'Globe', color: '#06b6d4', change: 1.4 },
];

export const funnelStages: FunnelStage[] = [
  { id: 'applications', name: 'Applications Received', nameAz: 'Müraciətlər daxil olur', count: 12450, dropoff: 0 },
  { id: 'telesales_pool', name: 'Telesales Pool', nameAz: 'Hovuz (Telesatış)', count: 12450, dropoff: 0 },
  { id: 'telesales_calls', name: 'Telesales Calls Made', nameAz: 'Telesatış zəngləri', count: 10350, dropoff: 16.9 },
  { id: 'successful_calls', name: 'Successful Calls', nameAz: 'Uğurlu zənglər', count: 8200, dropoff: 20.8 },
  { id: 'scoring', name: 'Scoring Stage', nameAz: 'Scoring mərhələsi', count: 8200, dropoff: 0 },
  { id: 'online_pool', name: 'Online Pool', nameAz: 'Hovuz (Online)', count: 7500, dropoff: 8.5 },
  { id: 'online_calls', name: 'Online Calls Made', nameAz: 'Online zəngləri', count: 6800, dropoff: 9.3 },
  { id: 'online_analysis', name: 'Credit Analysis', nameAz: 'Kredit təhlili', count: 6200, dropoff: 8.8 },
  { id: 'approved', name: 'Approved', nameAz: 'Təsdiqləndi', count: 4200, dropoff: 32.3 },
  { id: 'sold', name: 'Final Sales', nameAz: 'Satış olundu', count: 4200, dropoff: 0 },
];

export const sourceChannels: SourceChannel[] = [
  { name: 'Dostbank', applications: 3200, telesalesConverted: 2150, onlineConverted: 1680, sold: 1120, rejected: 480, color: '#3b82f6' },
  { name: 'bolkart.az', applications: 2800, telesalesConverted: 1850, onlineConverted: 1420, sold: 950, rejected: 410, color: '#8b5cf6' },
  { name: 'bankofbaku.com', applications: 2100, telesalesConverted: 1380, onlineConverted: 1050, sold: 710, rejected: 320, color: '#06b6d4' },
  { name: '145 Call Center', applications: 1950, telesalesConverted: 1320, onlineConverted: 1010, sold: 680, rejected: 290, color: '#f97316' },
  { name: 'Social Media', applications: 2400, telesalesConverted: 1500, onlineConverted: 1040, sold: 740, rejected: 300, color: '#ec4899' },
];

export const timeData: TimeDataPoint[] = [
  { month: 'Jan', applications: 920, telesalesProcessed: 750, onlineProcessed: 580, sold: 310, rejected: 120 },
  { month: 'Feb', applications: 880, telesalesProcessed: 720, onlineProcessed: 560, sold: 290, rejected: 115 },
  { month: 'Mar', applications: 1050, telesalesProcessed: 860, onlineProcessed: 670, sold: 350, rejected: 140 },
  { month: 'Apr', applications: 1100, telesalesProcessed: 900, onlineProcessed: 700, sold: 370, rejected: 145 },
  { month: 'May', applications: 1020, telesalesProcessed: 830, onlineProcessed: 640, sold: 340, rejected: 130 },
  { month: 'Jun', applications: 1150, telesalesProcessed: 940, onlineProcessed: 730, sold: 390, rejected: 150 },
  { month: 'Jul', applications: 1080, telesalesProcessed: 880, onlineProcessed: 680, sold: 360, rejected: 140 },
  { month: 'Aug', applications: 950, telesalesProcessed: 780, onlineProcessed: 600, sold: 320, rejected: 125 },
  { month: 'Sep', applications: 1200, telesalesProcessed: 980, onlineProcessed: 760, sold: 400, rejected: 155 },
  { month: 'Oct', applications: 1100, telesalesProcessed: 900, onlineProcessed: 690, sold: 370, rejected: 140 },
  { month: 'Nov', applications: 1050, telesalesProcessed: 860, onlineProcessed: 660, sold: 350, rejected: 135 },
  { month: 'Dec', applications: 950, telesalesProcessed: 780, onlineProcessed: 600, sold: 350, rejected: 105 },
];

export const sankeyNodes: SankeyNode[] = [
  { name: 'Dostbank' },           // 0
  { name: 'bolkart.az' },         // 1
  { name: 'bankofbaku.com' },     // 2
  { name: '145 Call Center' },    // 3
  { name: 'Social Media' },       // 4
  { name: 'Telesales Pool' },     // 5
  { name: 'Successful Calls' },   // 6
  { name: 'Unreachable' },        // 7
  { name: 'Scoring' },            // 8
  { name: 'Online Pool' },        // 9
  { name: 'Approved' },           // 10
  { name: 'Not Suitable' },       // 11
  { name: 'KBD' },                // 12
  { name: 'Branch Sales' },       // 13
  { name: 'Online Sales' },       // 14
  { name: 'Rejected' },           // 15
];

export const sankeyLinks: SankeyLink[] = [
  // Sources -> Telesales
  { source: 0, target: 5, value: 3200 },
  { source: 1, target: 5, value: 2800 },
  { source: 2, target: 5, value: 2100 },
  { source: 3, target: 5, value: 1950 },
  { source: 4, target: 5, value: 2400 },
  // Telesales -> outcomes
  { source: 5, target: 6, value: 8200 },
  { source: 5, target: 7, value: 2100 },
  { source: 5, target: 15, value: 2150 },
  // Successful -> Scoring
  { source: 6, target: 8, value: 8200 },
  // Scoring -> Online Pool
  { source: 8, target: 9, value: 7500 },
  { source: 8, target: 15, value: 700 },
  // Online Pool -> outcomes
  { source: 9, target: 10, value: 4200 },
  { source: 9, target: 11, value: 1800 },
  { source: 9, target: 12, value: 1500 },
  // Approved -> final
  { source: 10, target: 13, value: 2500 },
  { source: 10, target: 14, value: 1700 },
  // Not suitable -> rejected
  { source: 11, target: 15, value: 1800 },
  // KBD -> outcomes
  { source: 12, target: 13, value: 600 },
  { source: 12, target: 14, value: 400 },
  { source: 12, target: 15, value: 500 },
];
