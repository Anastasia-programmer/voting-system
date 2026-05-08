"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { useRequireAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useRequireAuth();

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <Sidebar />
      <div className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}
