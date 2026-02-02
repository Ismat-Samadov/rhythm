# Funnel Analysis Dashboard

Interactive analytics dashboard for monitoring cash loan and credit card application funnels. Built with Next.js, React, and modern data visualization libraries.

## Features

- **KPI Cards** — Total applications, conversion rate, rejection rate, processing time, telesales and online sales rates
- **Conversion Funnel** — 6-stage visual funnel from applications to final sales
- **Stage Breakdown** — Detailed 10-stage breakdown with drop-off percentages
- **Source Comparison** — Bar chart comparing 5 acquisition channels (Dostbank, bolkart.az, bankofbaku.com, 145 Call Center, Social Media)
- **Time Trends** — 12-month area chart showing volume trends
- **Sankey Diagram** — Flow visualization across all funnel stages
- **Interactive Flow** — React Flow node-based process diagram
- **Dark/Light Mode** — Theme toggle with system preference fallback

## Tech Stack

- **Next.js 16** with React 19 and TypeScript
- **Tailwind CSS 4** for styling
- **Recharts** for charts and graphs
- **React Flow** for interactive flow diagrams
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── layout/
│   │   └── Header.tsx      # Header with branding and theme toggle
│   ├── dashboard/
│   │   ├── KpiCards.tsx
│   │   ├── ConversionFunnel.tsx
│   │   ├── StageBreakdown.tsx
│   │   ├── SourceComparison.tsx
│   │   ├── TimeTrends.tsx
│   │   ├── SankeyChart.tsx
│   │   └── FunnelFlow.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── AnimatedNumber.tsx
│       └── ThemeToggle.tsx
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── data.ts             # Sample data
    ├── constants.ts        # Color palettes
    └── utils.ts            # Format helpers
```
