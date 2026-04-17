import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore"
import { useSession } from "next-auth/react"
import { Device, SEED_DEVICES } from "@/types/device"
import { SystemLog } from "@/types/log"

export function useDevices() {
  const { data: session } = useSession()
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
      const now = new Date().toISOString()
      
      await updateDoc(ref, {
        isOn: !currentState,
        lastUpdated: now,
      })

      // 📝 RECORD SYSTEM LOG
      const logEntry: SystemLog = {
        deviceId,
        deviceTitle: devices.find(d => d.id === deviceId)?.title || deviceId,
        action: !currentState ? "Turned ON" : "Turned OFF",
        timestamp: now,
        adminName: session?.user?.name || "System",
        adminEmail: session?.user?.email || "unknown",
      }
      await addDoc(collection(db, "logs"), logEntry)

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
        devices.map(async (d) => {
          await updateDoc(doc(db, "devices", d.id), { isOn: state, lastUpdated: now })
          
          const logEntry: SystemLog = {
            deviceId: d.id,
            deviceTitle: d.title,
            action: state ? "Turned ON" : "Turned OFF",
            timestamp: now,
            adminName: session?.user?.name || "System",
            adminEmail: session?.user?.email || "unknown",
          }
          return addDoc(collection(db, "logs"), logEntry)
        })
      )
    } catch (err) {
      console.error("[Devices] Bulk toggle failed:", err)
    } finally {
      setToggling(null)
    }
  }

  return {
    devices,
    loading,
    connected,
    toggling,
    toggleDevice,
    setAllDevices,
  }
}
