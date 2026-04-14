"use client" // Wajib ditambahkan agar bisa mengambil data session (useSession)

import { useSession } from "next-auth/react"
import Image from "next/image"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mengambil data user yang sedang login
  const { data: session } = useSession()

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-zinc-800/50 bg-background/95 backdrop-blur px-6">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-zinc-800/50" />
          <div className="flex-1" />
          
          {/* === BAGIAN PROFIL USER === */}
          {session?.user && (
            <div className="flex items-center gap-3 mr-4 border-r border-zinc-800 pr-4">
              <span className="text-sm font-medium text-zinc-200">
                Welcome, {session.user.name || session.user.email?.split('@')}
              </span>
              
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={40}
                  height={40}
                  // Konversi CSS lamamu ke Tailwind (Efek glow & hover scale)
                  className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                />
              ) : (
                // Fallback (jika login pakai email/password biasa yg tidak ada fotonya)
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                  {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || "A"}
                </div>
              )}
            </div>
          )}
          {/* === END BAGIAN PROFIL USER === */}

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}