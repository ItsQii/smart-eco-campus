"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Fan, Plug, Power, Activity, Wifi, WifiOff } from "lucide-react"

interface Device {
  id: string
  title: string
  description: string
  powerUsage: number
  location: string
  isOn: boolean
  lastUpdated: string
}

const SEED_DEVICES: Omit<Device, "lastUpdated">[] = [
  {
    id: "lamp",
    title: "Classroom Lamp",
    description: "Main lighting system for the classroom area",
    powerUsage: 120,
    location: "Room 101",
    isOn: true,
  },
  {
    id: "acFan",
    title: "AC / Fan System",
    description: "Climate control and ventilation unit",
    powerUsage: 850,
    location: "Room 101",
    isOn: false,
  },
  {
    id: "pcProjector",
    title: "PC / Projector Socket",
    description: "Power outlet for computing equipment",
    powerUsage: 450,
    location: "Room 101",
    isOn: true,
  },
]

const ICON_MAP: Record<string, React.ElementType> = {
  lamp: Lightbulb,
  acFan: Fan,
  pcProjector: Plug,
}

export default function DeviceControlPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    const seedIfEmpty = async () => {
      const now = new Date().toISOString()
      for (const seed of SEED_DEVICES) {
        const ref = doc(db, "devices", seed.id)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, { ...seed, lastUpdated: now })
          console.log(`[Devices] Seeded: ${seed.id}`)
        }
      }
    }
    seedIfEmpty()
  }, [])

  useEffect(() => {
    const colRef = collection(db, "devices")
    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        const data: Device[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Device, "id">),
        }))
        data.sort(
          (a, b) =>
            SEED_DEVICES.findIndex((s) => s.id === a.id) -
            SEED_DEVICES.findIndex((s) => s.id === b.id)
        )
        setDevices(data)
        setConnected(true)
        setLoading(false)
      },
      (error) => {
        console.error("[Devices] Firestore error:", error)
        setConnected(false)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  const toggleDevice = async (deviceId: string, currentState: boolean) => {
    if (toggling) return
    setToggling(deviceId)
    try {
      const ref = doc(db, "devices", deviceId)
      await updateDoc(ref, {
        isOn: !currentState,
        lastUpdated: new Date().toISOString(),
      })
    } catch (err) {
      console.error("[Devices] Toggle failed:", err)
    } finally {
      setToggling(null)
    }
  }

  const setAllDevices = async (state: boolean) => {
    if (toggling) return
    setToggling("all")
    try {
      const now = new Date().toISOString()
      await Promise.all(
        devices.map((d) =>
          updateDoc(doc(db, "devices", d.id), { isOn: state, lastUpdated: now })
        )
      )
    } catch (err) {
      console.error("[Devices] Bulk toggle failed:", err)
    } finally {
      setToggling(null)
    }
  }

  const activeCount = devices.filter((d) => d.isOn).length
  const totalWatts = devices.reduce((sum, d) => sum + (d.isOn ? d.powerUsage : 0), 0)

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Power className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Device Control</h1>
            <p className="text-sm text-muted-foreground">Connecting to Firestore…</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

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
              Manage and monitor IoT devices in real-time · synced via Firebase
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Active count */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">
            <span className="text-emerald-500 font-semibold">{activeCount}</span> of{" "}
            <span className="font-semibold text-foreground">{devices.length}</span> devices active
          </span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        {/* Firebase connection */}
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi className="w-4 h-4 text-emerald-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm ${connected ? "text-emerald-500" : "text-red-400"}`}>
            {connected ? "Firebase Connected" : "Firebase Disconnected"}
          </span>
        </div>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Live sync enabled</span>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isOn = device.isOn
          const Icon = ICON_MAP[device.id] ?? Plug
          const isBeingToggled = toggling === device.id || toggling === "all"

          return (
            <Card
              key={device.id}
              className={`relative overflow-hidden bg-zinc-900 border transition-all duration-500 ${isOn
                  ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                  : "border-zinc-800 hover:border-zinc-700"
                }`}
            >
              {/* Glow overlay */}
              {isOn && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
              )}

              {/* Top status bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-500 ${isOn ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
              />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOn
                          ? "bg-emerald-500/20 border border-emerald-500/40"
                          : "bg-zinc-800 border border-zinc-700"
                        }`}
                    >
                      {isOn && (
                        <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl" />
                      )}
                      <Icon
                        className={`relative w-8 h-8 transition-all duration-500 ${isOn ? "text-emerald-400" : "text-zinc-500"
                          } ${isOn && device.id === "acFan" ? "animate-spin" : ""} ${isOn && device.id === "lamp" ? "animate-pulse" : ""
                          } ${isOn && device.id === "pcProjector" ? "animate-pulse" : ""}`}
                        style={
                          isOn
                            ? {
                              animationDuration:
                                device.id === "acFan"
                                  ? "3s"
                                  : device.id === "pcProjector"
                                    ? "2.5s"
                                    : "2s",
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

                  {/* Status dot */}
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

                {/* Info row */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Power</span>
                    <span className={`font-mono font-semibold ${isOn ? "text-emerald-400" : "text-zinc-500"}`}>
                      {isOn ? `${device.powerUsage}W` : "0W"}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Location</span>
                    <span className="font-medium text-foreground">{device.location}</span>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Updated</span>
                    <span className="font-medium text-foreground text-xs">
                      {device.lastUpdated
                        ? new Date(device.lastUpdated).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Toggle control */}
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
                    <span className="text-sm font-medium text-foreground">Power Control</span>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleDevice(device.id, isOn)}
                    disabled={!!isBeingToggled}
                    className={`relative w-16 h-8 rounded-full transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed ${isOn
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


function FirestoreDebugPanel({
  devices,
  connected,
}: {
  devices: Device[]
  connected: boolean
}) {
  const [open, setOpen] = useState(false)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "—"
  const now = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
          />
          <span className="text-sm font-medium text-muted-foreground font-mono">
            🔍 Firestore Debug Panel
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
            {devices.length} docs · {projectId}
          </span>
        </div>
        <span className="text-xs text-zinc-600 font-mono">
          {open ? "▲ sembunyikan" : "▼ tampilkan"}
        </span>
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-zinc-800">
          {/* Status row */}
          <div className="flex flex-wrap gap-4 pt-4 text-xs font-mono text-zinc-500">
            <span>
              Status:{" "}
              <span className={connected ? "text-emerald-400" : "text-red-400"}>
                {connected ? "✅ Connected" : "❌ Disconnected"}
              </span>
            </span>
            <span>·</span>
            <span>Project: <span className="text-zinc-300">{projectId}</span></span>
            <span>·</span>
            <span>Collection: <span className="text-zinc-300">devices</span></span>
            <span>·</span>
            <span>Last sync: <span className="text-zinc-300">{now}</span></span>
          </div>

          {/* Document list */}
          {devices.length === 0 ? (
            <p className="text-sm text-red-400 font-mono">
              ⚠ Tidak ada dokumen yang ditemukan di koleksi &quot;devices&quot;.
            </p>
          ) : (
            <div className="space-y-3">
              {devices.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-zinc-500">doc id:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {d.id}
                    </span>
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full font-mono ${d.isOn
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      isOn: {String(d.isOn)}
                    </span>
                  </div>
                  <pre className="text-xs text-zinc-400 font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(
                      { title: d.title, powerUsage: d.powerUsage, location: d.location, lastUpdated: d.lastUpdated },
                      null,
                      2
                    )}
                  </pre>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-zinc-600 font-mono">
            💡 Panel ini hanya untuk development. Hapus atau sembunyikan sebelum deploy ke production.
          </p>
        </div>
      )}
    </div>
  )
}