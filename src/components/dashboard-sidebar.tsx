"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Zap,
  LogOut,
  Leaf,
  Power,
  FileText,
  BarChart3,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { signOut } from "next-auth/react";

const mainNavItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { title: "Device Control", icon: Power, href: "/dashboard/devices" },
  { title: "Logs", icon: FileText, href: "/dashboard/logs" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar className="border-r border-zinc-800/50">
      {/* HEADER */}
      <SidebarHeader className="border-b border-zinc-800/50 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors duration-300">
            <Leaf className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              Eco-Campus
            </span>
            <span className="text-xs text-muted-foreground">
              Control Center
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className="h-10 px-3 data-[active=true]:bg-emerald-500/10 data-[active=true]:text-emerald-500 data-[active=true]:border-emerald-500/30 hover:bg-zinc-800/50"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-zinc-800/50 px-2 py-4 gap-2">
        <SidebarMenu>
          {/* STATUS */}
          <SidebarMenuItem>
            <div className="flex items-center gap-3 h-10 px-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  System Online
                </span>
                <span className="text-[10px] text-emerald-500 truncate">
                  All sensors active
                </span>
              </div>
            </div>
          </SidebarMenuItem>

          {/* LOGOUT */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-10 px-3 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}