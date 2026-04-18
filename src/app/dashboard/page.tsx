"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadialGauge } from "@/components/radial-gauge"
import { Camera, Users, Wifi, Activity, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { doc, setDoc } from "firebase/firestore"  
import { db } from "@/lib/firebase"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    watt: 124.5,
    volt: 220.8,
    ampere: 0.57,
    occupancy: 0,
  })

  useEffect(() => {
    const interval = setInterval(async () => {
      
      const newData = {
        watt: 120 + Math.random() * 20,
        volt: 218 + Math.random() * 5,
        ampere: 0.5 + Math.random() * 0.2,
        occupancy: Math.floor(Math.random() * 5),
        timestamp: new Date().toISOString()
      }

      setMetrics(newData)

      try {
        const docRef = doc(db, "sensors", "latest");
        await setDoc(docRef, newData);
        console.log("✅ Berhasil update Firebase:", newData.watt.toFixed(2), "Watt");
      } catch (error) {
        console.error("❌ Gagal mengirim ke Firebase:", error);
      }

    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring and analytics for Eco-Campus systems
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live AI Camera Feed - Large Card */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardHeader className="border-b border-zinc-800 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <CardTitle className="text-foreground">Live AI Camera Feed</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">ESP32-CAM Stream - Building A</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-500 font-medium">LIVE</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Camera Feed Placeholder */}
            <div className="relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden">
              {/* Grid overlay effect */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
              
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="absolute left-0 right-0 h-px bg-emerald-500/30 animate-pulse"
                  style={{
                    animation: 'scanline 3s linear infinite',
                    top: '50%',
                  }}
                />
              </div>
              
              {/* Center content */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center">
                  <Camera className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="text-center">
                  <p className="text-zinc-500 font-medium">Live AI Camera Feed</p>
                  <p className="text-xs text-zinc-600 mt-1">ESP32-CAM stream will appear here</p>
                </div>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/50" />

              {/* Status overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">Connected</span>
                </div>
                <div className="w-px h-3 bg-zinc-700" />
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span className="text-xs text-muted-foreground">30 FPS</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Occupancy & Status */}
        <div className="space-y-6">
          {/* Room Occupancy Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <CardTitle className="text-foreground text-base">Room Occupancy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-zinc-800 border-4 border-emerald-500/30 flex items-center justify-center">
                    <span className="text-4xl font-bold text-foreground tabular-nums">
                      {metrics.occupancy}
                    </span>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
                </div>
                <p className="text-sm text-muted-foreground mt-4">Current Room Occupancy</p>
                <p className="text-xs text-emerald-500 mt-1 font-medium">
                  {metrics.occupancy === 0 ? "Room Empty" : `${metrics.occupancy} ${metrics.occupancy === 1 ? 'Person' : 'People'} Detected`}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <CardTitle className="text-foreground text-base">System Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-sm text-muted-foreground">IoT Sensors</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-500">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-sm text-muted-foreground">AI Processing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-500">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Data Pipeline</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-emerald-500">Streaming</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Electrical Metrics - Gauge Row */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-foreground">Real-Time Electrical Metrics</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Live power consumption monitoring</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
            <RadialGauge
              value={metrics.watt}
              maxValue={500}
              label="Power Consumption"
              unit="Watt"
              size={160}
            />
            <RadialGauge
              value={metrics.volt}
              maxValue={250}
              label="Voltage"
              unit="Volt"
              size={160}
            />
            <RadialGauge
              value={metrics.ampere}
              maxValue={2}
              label="Current"
              unit="Ampere"
              size={160}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
