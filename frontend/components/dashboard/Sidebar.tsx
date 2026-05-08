"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Vote,
  ScrollText,
  Settings,
  Users,
  ShieldAlert,
  Activity,
  BarChart3,
  ServerCog,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

type NavItem = { href: string; label: string; icon: typeof Vote };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  voter: [
    { href: "/dashboard",            label: "Overview",      icon: LayoutDashboard },
    { href: "/dashboard/elections",  label: "Elections",     icon: Vote },
    { href: "/dashboard/my-votes",   label: "My votes",      icon: ScrollText },
    { href: "/verify",               label: "Verify a vote", icon: ShieldCheck },
  ],
  admin: [
    { href: "/dashboard",                       label: "Overview",   icon: LayoutDashboard },
    { href: "/dashboard/admin/elections",       label: "Elections",  icon: Vote },
    { href: "/dashboard/admin/users",           label: "Users",      icon: Users },
    { href: "/dashboard/admin/settings",        label: "Settings",   icon: Settings },
  ],
  commissioner: [
    { href: "/dashboard",                          label: "Overview",        icon: LayoutDashboard },
    { href: "/dashboard/commissioner/activity",    label: "Activity",        icon: Activity },
    { href: "/dashboard/commissioner/complaints",  label: "Complaints",      icon: ShieldAlert },
  ],
  counter: [
    { href: "/dashboard",                  label: "Overview",        icon: LayoutDashboard },
    { href: "/dashboard/counter/ballots",  label: "Encrypted votes", icon: Vote },
    { href: "/dashboard/counter/results",  label: "Tally & results", icon: BarChart3 },
  ],
  anonymizer: [
    { href: "/dashboard",                    label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/anonymizer/system",  label: "System",   icon: ServerCog },
    { href: "/dashboard/anonymizer/logs",    label: "Logs",     icon: Activity },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.voter;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-white/[.06] bg-ink-950/40 px-3 py-6 backdrop-blur-md lg:flex">
      <div className="mb-4 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-slate-500">Workspace</p>
        <p className="mt-1 truncate text-sm font-semibold text-white">{user.full_name}</p>
        <p className="mt-0.5 text-xs text-slate-500 capitalize">{user.role}</p>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                active
                  ? "bg-primary-500/10 text-white shadow-glow-sm ring-1 ring-primary-400/30"
                  : "text-slate-400 hover:bg-white/[.04] hover:text-white",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary-300" : "text-slate-500 group-hover:text-slate-300")} />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-neon-red/10 hover:text-neon-red"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
