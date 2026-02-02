"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import KpiCards from "@/components/dashboard/KpiCards";
import StageBreakdown from "@/components/dashboard/StageBreakdown";
import ConversionFunnel from "@/components/dashboard/ConversionFunnel";

const SourceComparison = dynamic(() => import("@/components/dashboard/SourceComparison"), { ssr: false });
const TimeTrends = dynamic(() => import("@/components/dashboard/TimeTrends"), { ssr: false });
const SankeyChart = dynamic(() => import("@/components/dashboard/SankeyChart"), { ssr: false });
const FunnelFlow = dynamic(() => import("@/components/dashboard/FunnelFlow"), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient tracking-tight">Dashboard Overview</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Real-time funnel metrics for cash loan and Bolkart credit card applications
          </p>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          <KpiCards />
          <ConversionFunnel />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <FunnelFlow />
          </div>
          <StageBreakdown />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <SourceComparison />
            <TimeTrends />
          </div>
          <SankeyChart />
        </div>

        <footer className="mt-8 sm:mt-12 pb-6 sm:pb-8 text-center">
          <p className="text-[11px] text-[var(--color-text-muted)]">
            Funnel Analysis Dashboard — All data is illustrative
          </p>
        </footer>
      </main>
    </div>
  );
}
