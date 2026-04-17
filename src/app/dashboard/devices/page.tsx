"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Power } from "lucide-react"
import { useDevices } from "@/hooks/use-devices"
import { DeviceSkeleton } from "./components/device-skeleton"
import { DeviceStats } from "./components/device-stats"
import { DeviceCard } from "./components/device-card"
import { FirestoreDebugPanel } from "./components/firestore-debug-panel"

export default function DeviceControlPage() {
  const {
    devices,
    loading,
    connected,
    toggling,
    toggleDevice,
    setAllDevices,
  } = useDevices()

  if (loading) {
    return <DeviceSkeleton />
  }

  const activeCount = devices.filter((d) => d.isOn).length
  const totalWatts = devices.reduce((sum, d) => sum + (d.isOn ? d.powerUsage : 0), 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Power className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Device Control</h1>
            <p className="text-sm text-muted-foreground">
              Manage and monitor IoT devices in real-time
            </p>
          </div>
        </div>
      </div>

      <DeviceStats devices={devices} connected={connected} />

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            toggling={toggling}
            onToggle={toggleDevice}
          />
        ))}
      </div>

      {/* Quick Actions Footer */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Quick Actions:</span>
              <button
                onClick={() => setAllDevices(true)}
                disabled={!!toggling}
                className="px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                All On
              </button>
              <button
                onClick={() => setAllDevices(false)}
                disabled={!!toggling}
                className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                All Off
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total Power:</span>
              <span className="font-mono font-semibold text-emerald-400">{totalWatts}W</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Firestore Debug Panel ── */}
      <FirestoreDebugPanel devices={devices} connected={connected} />
    </div>
  )
}