"use client"

import { useState, useMemo, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Search,
  Calendar,
  Lightbulb,
  Fan,
  Plug,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  RefreshCw,
  Power,
  PowerOff,
} from "lucide-react"

const ITEMS_PER_PAGE = 8

const deviceIcons: Record<string, React.ReactNode> = {
  lamp: <Lightbulb className="w-4 h-4" />,
  fan: <Fan className="w-4 h-4" />,
  plug: <Plug className="w-4 h-4" />,
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // 🔥 Ambil data dari Firebase (devices)
  useEffect(() => {
    const colRef = collection(db, "devices")

    const unsub = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data()

        return {
          id: doc.id,
          dateTime: d.lastUpdated,
          device: d.title,
          action: d.isOn ? "Turned ON" : "Turned OFF",
          reason: "-", // belum ada di device
          deviceType:
            doc.id === "lamp"
              ? "lamp"
              : doc.id === "acFan"
              ? "fan"
              : "plug",
        }
      })

      // urutkan terbaru
      data.sort(
        (a, b) =>
          new Date(b.dateTime).getTime() -
          new Date(a.dateTime).getTime()
      )

      setLogs(data)
    })

    return () => unsub()
  }, [])

  // 🔍 Filter
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())

      let matchesDate = true

      const logDate = new Date(log.dateTime)
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate =
          logDate.toDateString() === today.toDateString()
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        matchesDate =
          logDate.toDateString() === yesterday.toDateString()
      }

      return matchesSearch && matchesDate
    })
  }, [logs, searchQuery, dateFilter])

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // 📊 Stats
  const stats = useMemo(() => {
    const onActions = logs.filter((log) => log.action === "Turned ON").length
    const offActions = logs.filter((log) => log.action === "Turned OFF").length
    return { onActions, offActions, total: logs.length }
  }, [logs])

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          <p className="text-sm text-muted-foreground">
            Automation history and device activity records
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Devices ON</p>
            <p className="text-2xl font-bold text-emerald-500">
              {stats.onActions}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Devices OFF</p>
            <p className="text-2xl font-bold text-red-400">
              {stats.offActions}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Automation History</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedLogs.map((log) => {
                const date = new Date(log.dateTime)

                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div>
                        <div>{date.toLocaleDateString("id-ID")}</div>
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleTimeString("id-ID")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {deviceIcons[log.deviceType]}
                        {log.device}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          log.action === "Turned ON"
                            ? "text-emerald-500"
                            : "text-red-400"
                        }
                      >
                        {log.action}
                      </span>
                    </TableCell>

                    <TableCell>{log.reason}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
            >
              Prev
            </Button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <Button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}