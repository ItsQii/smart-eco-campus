"use client"

import { useState, useMemo, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"

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
  Clock,
  User,
  Power,
  PowerOff,
} from "lucide-react"
import { SystemLog } from "@/types/log"

const ITEMS_PER_PAGE = 8

const deviceIcons: Record<string, React.ReactNode> = {
  lamp: <Lightbulb className="w-4 h-4" />,
  acFan: <Fan className="w-4 h-4" />,
  pcProjector: <Plug className="w-4 h-4" />,
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // 📡 Real-time fetch from "logs" collection
  useEffect(() => {
    const colRef = collection(db, "logs")
    const q = query(colRef, orderBy("timestamp", "desc"))

    const unsub = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<SystemLog, "id">),
      }))

      // Sort manually because snapshot might not be perfectly ordered initially
      data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setLogs(data)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  // 🔍 Filter & 30-day Retention (Frontend Only)
  const filteredLogs = useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return logs.filter((log) => {
      const logDate = new Date(log.timestamp)
      
      // 1. 30-day retention check
      if (logDate < thirtyDaysAgo) return false

      // 2. Search query check
      const matchesSearch =
        log.deviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase())

      // 3. Quick date filter
      let matchesDate = true
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = logDate.toDateString() === today.toDateString()
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        matchesDate = logDate.toDateString() === yesterday.toDateString()
      }

      return matchesSearch && matchesDate
    })
  }, [logs, searchQuery, dateFilter])

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const stats = useMemo(() => {
    const onActions = logs.filter((log) => log.action === "Turned ON").length
    const offActions = logs.filter((log) => log.action === "Turned OFF").length
    return { onActions, offActions, total: logs.length }
  }, [logs])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Logs</h1>
          <p className="text-sm text-muted-foreground">
            Automation history and device activity records (Last 30 days)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-zinc-800">
              <Clock className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Power className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Turned ON</p>
              <p className="text-2xl font-bold text-emerald-500">{stats.onActions}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <PowerOff className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Turned OFF</p>
              <p className="text-2xl font-bold text-red-400">{stats.offActions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Activity Records</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search devices or actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-64 bg-zinc-950 border-zinc-800 text-sm"
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-9 w-32 bg-zinc-950 border-zinc-800 text-sm">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-800/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-48">Date & Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Loading logs...
                    </TableCell>
                  </TableRow>
                ) : paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => {
                    const date = new Date(log.timestamp)
                    const Icon = deviceIcons[log.deviceId] || <Plug className="w-4 h-4" />

                    return (
                      <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-zinc-200">
                              {date.toLocaleDateString("id-ID")}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {date.toLocaleTimeString("id-ID")}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                              {Icon}
                            </div>
                            <span className="font-medium text-zinc-200">{log.deviceTitle}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              log.action === "Turned ON"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {log.action}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                              <User className="w-3 h-3 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-zinc-200">{log.adminName}</span>
                              <span className="text-[10px] text-zinc-500">{log.adminEmail}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-zinc-500 font-mono">
              Showing {paginatedLogs.length} of {filteredLogs.length} logs
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-zinc-200 px-3 py-1 bg-zinc-800 rounded-md">
                  {currentPage}
                </span>
                <span className="text-sm text-zinc-500">of {totalPages || 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}