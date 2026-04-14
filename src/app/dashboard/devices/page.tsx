"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Fan, Plug, Power, Activity } from "lucide-react"

interface DeviceState {
  lamp: boolean
  acFan: boolean
  pcProjector: boolean
}

export default function DeviceControlPage() {
  const [devices, setDevices] = useState<DeviceState>({
    lamp: true,
    acFan: false,
    pcProjector: true,
  })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedDevices = localStorage.getItem("classroomDevices")
    if (savedDevices) {
      try {
        setDevices(JSON.parse(savedDevices))
      } catch (error) {
        console.error("Gagal membaca localStorage", error)
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("classroomDevices", JSON.stringify(devices))
    }
  }, [devices, isMounted])

  const toggleDevice = (device: keyof DeviceState) => {
    setDevices((prev) => ({ ...prev, [device]: !prev[device] }))
  }

  const deviceCards = [
    {
      id: "lamp" as const,
      title: "Classroom Lamp",
      description: "Main lighting system for the classroom area",
      icon: Lightbulb,
      powerUsage: "120W",
      location: "Room 101",
    },
    {
      id: "acFan" as const,
      title: "AC/Fan System",
      description: "Climate control and ventilation unit",
      icon: Fan,
      powerUsage: "850W",
      location: "Room 101",
    },
    {
      id: "pcProjector" as const,
      title: "PC/Projector Socket",
      description: "Power outlet for computing equipment",
      icon: Plug,
      powerUsage: "450W",
      location: "Room 101",
    },
  ]

  const activeDevices = Object.values(devices).filter(Boolean).length

  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Memuat status perangkat...</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
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

      {/* Status Summary */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            <span className="text-emerald-500 font-semibold">{activeDevices}</span> of{" "}
            <span className="font-semibold text-foreground">{deviceCards.length}</span> devices active
          </span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">All systems operational</span>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deviceCards.map((device) => {
          const isOn = devices[device.id]
          const Icon = device.icon

          return (
            <Card
              key={device.id}
              className={`relative overflow-hidden bg-zinc-900 border transition-all duration-500 ${isOn
                  ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              {/* Glow Effect for ON state */}
              {isOn && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              )}

              {/* Status Indicator Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${isOn ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
              />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOn
                          ? "bg-emerald-500/20 border border-emerald-500/40"
                          : "bg-zinc-800 border border-zinc-700"
                        }`}
                    >
                      {/* Glow ring for ON state */}
                      {isOn && (
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl" />
                      )}
                      <Icon
                        className={`relative w-8 h-8 transition-all duration-500 ${isOn ? "text-emerald-400" : "text-zinc-500"
                          } ${
                          isOn && device.id === "acFan" ? "animate-spin" : ""
                          } ${
                          isOn && device.id === "lamp" ? "animate-pulse" : ""
                          } ${
                          isOn && device.id === "pcProjector" ? "animate-pulse" : ""
                          }`}
                        style={
                          isOn
                            ? {
                              animationDuration:
                                device.id === "acFan" ? "3s" :
                                  device.id === "pcProjector" ? "2.5s" : "2s"
                            }
                            : undefined
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {device.title}
                      </CardTitle>
                      <span
                        className={`text-xs font-medium uppercase tracking-wider mt-1 ${isOn ? "text-emerald-500" : "text-red-400/70"
                          }`}
                      >
                        {isOn ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                  {/* Status Dot */}
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${isOn
                        ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                        : "bg-red-500/50"
                      }`}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {device.description}
                </p>

                {/* Device Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Power
                      </span>
                      <span
                        className={`font-mono font-semibold ${isOn ? "text-emerald-400" : "text-zinc-500"
                          }`}
                      >
                        {isOn ? device.powerUsage : "0W"}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Location
                      </span>
                      <span className="font-medium text-foreground">
                        {device.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle Control */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${isOn
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-zinc-800/50 border-zinc-700/50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Power
                      className={`w-5 h-5 transition-colors duration-500 ${isOn ? "text-emerald-500" : "text-zinc-500"
                        }`}
                    />
                    <span className="text-sm font-medium text-foreground">
                      Power Control
                    </span>
                  </div>

                  {/* Custom Large Toggle Switch */}
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-500 ${isOn
                        ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                        : "bg-zinc-700"
                      }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-500 ${isOn ? "left-9" : "left-1"
                        }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions Footer */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Quick Actions:</span>
              <button
                onClick={() => setDevices({ lamp: true, acFan: true, pcProjector: true })}
                className="px-4 py-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
              >
                All On
              </button>
              <button
                onClick={() => setDevices({ lamp: false, acFan: false, pcProjector: false })}
                className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                All Off
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Total Power:</span>
              <span className="font-mono font-semibold text-emerald-400">
                {(devices.lamp ? 120 : 0) + (devices.acFan ? 850 : 0) + (devices.pcProjector ? 450 : 0)}W
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}