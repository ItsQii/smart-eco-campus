"use client"

import { motion, Variants } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useAnalyticsData } from "@/hooks/use-analytics-data"
import { AnalyticsHeader } from "./components/analytics-header"
import { StatsCards } from "./components/stats-cards"
import { UsagePatternChart } from "./components/usage-pattern-chart"
import { UsageDistributionChart } from "./components/usage-distribution-chart"

// --- ANIMATION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
}

const chartVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
}

export default function AnalyticsPage() {
  const {
    timeRange,
    setTimeRange,
    rawLogs,
    mainData,
    stats,
    loading,
    seeding,
    clearing,
    handleClearHistory,
    handleSeedHistory
  } = useAnalyticsData()

  return (
    <TooltipProvider>
      <motion.div 
        className="flex flex-col gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnalyticsHeader 
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onReset={handleClearHistory}
          onSeed={handleSeedHistory}
          isClearing={clearing}
          isSeeding={seeding}
        />

        <StatsCards 
          stats={stats} 
          cardVariants={cardVariants} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          <UsagePatternChart 
            data={mainData} 
            chartVariants={cardVariants} 
            isEmpty={rawLogs.length === 0}
          />

          <UsageDistributionChart 
            chartVariants={cardVariants} 
            isEmpty={rawLogs.length === 0}
          />
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
