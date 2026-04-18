"use client"

import { useState, useMemo, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { seedSensorHistory, clearSensorHistory } from "@/lib/seeder"
import { toast } from "sonner"

export interface HistoryRecord {
  id: string
  watt: number
  timestamp: any // Firestore Timestamp
}

export interface ChartData {
  time: string
  watt: number
}

export interface AnalyticsStats {
  total: number
  peak: number
  cost: number
  peakTime: string
}

export function useAnalyticsData() {
  const [timeRange, setTimeRange] = useState("24h")
  const [rawLogs, setRawLogs] = useState<HistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [clearing, setClearing] = useState(false)

  // 📡 Real-time fetch from "sensor_history" collection
  useEffect(() => {
    const colRef = collection(db, "sensor_history")
    const q = query(colRef, orderBy("timestamp", "asc"))

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HistoryRecord[]
      
      setRawLogs(data)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  // 🧪 Process Firestore data based on timeRange
  const mainData = useMemo<ChartData[]>(() => {
    if (rawLogs.length === 0) return []
    const now = new Date()
    let filtered = rawLogs

    if (timeRange === "24h") {
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      filtered = rawLogs.filter(log => {
        const logDate = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000);
        return logDate >= twentyFourHoursAgo;
      })
      
      return filtered.map(log => {
        const logDate = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000);
        return {
          time: logDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          watt: log.watt
        }
      })
    } 

    if (timeRange === "7d" || timeRange === "30d") {
      const limitDays = timeRange === "7d" ? 7 : 30
      const startDate = new Date(now.getTime() - limitDays * 24 * 60 * 60 * 1000)
      filtered = rawLogs.filter(log => {
        const logDate = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000);
        return logDate >= startDate;
      })

      if (filtered.length === 0) return []

      const grouped: Record<string, { totalWatt: number, count: number }> = {}
      filtered.forEach(log => {
        const logDate = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000);
        const dateStr = logDate.toLocaleDateString("id-ID", { weekday: 'short' })
        if (!grouped[dateStr]) grouped[dateStr] = { totalWatt: 0, count: 0 }
        grouped[dateStr].totalWatt += log.watt
        grouped[dateStr].count += 1
      })

      return Object.entries(grouped).map(([day, stats]) => ({
        time: day,
        watt: parseFloat((stats.totalWatt / stats.count).toFixed(2))
      }))
    }
    return []
  }, [rawLogs, timeRange])

  // 🧮 Derived Metrics from Real Data
  const stats = useMemo<AnalyticsStats>(() => {
    if (rawLogs.length === 0) return { total: 0, peak: 0, cost: 0, peakTime: "—" }
    const totalWatt = rawLogs.reduce((sum, log) => sum + log.watt, 0)
    const totalKwh = totalWatt / 1000 
    
    let peakWatt = 0
    let peakTimeStr = "—"
    rawLogs.forEach(log => {
      if (log.watt > peakWatt) {
        peakWatt = log.watt
        const logDate = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date(log.timestamp.seconds * 1000);
        peakTimeStr = logDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      }
    })

    return {
      total: parseFloat(totalKwh.toFixed(1)),
      peak: parseFloat(peakWatt.toFixed(1)),
      cost: Math.round(totalKwh * 1444.7),
      peakTime: peakTimeStr === "—" ? "—" : `${peakTimeStr}`
    }
  }, [rawLogs])

  const handleClearHistory = async () => {
    setClearing(true)
    const promise = clearSensorHistory()
    toast.promise(promise, {
      loading: 'Clearing all analytics history...',
      success: (count) => {
        setClearing(false)
        return `Successfully wiped ${count} records!`
      },
      error: () => {
        setClearing(false)
        return 'Failed to clear history'
      },
    })
  }

  const handleSeedHistory = async () => {
    setSeeding(true)
    const promise = seedSensorHistory()
    toast.promise(promise, {
      loading: 'Seeding 7-day history data...',
      success: (count) => {
        setSeeding(false)
        return `Successfully seeded ${count} data points!`
      },
      error: () => {
        setSeeding(false)
        return 'Failed to seed history'
      },
    })
  }

  return {
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
  }
}
