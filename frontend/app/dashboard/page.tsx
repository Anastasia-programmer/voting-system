"use client";

import { useAuth } from "@/hooks/useAuth";
import { VoterOverview } from "@/components/dashboard/overviews/VoterOverview";
import { AdminOverview } from "@/components/dashboard/overviews/AdminOverview";
import { CommissionerOverview } from "@/components/dashboard/overviews/CommissionerOverview";
import { CounterOverview } from "@/components/dashboard/overviews/CounterOverview";
import { AnonymizerOverview } from "@/components/dashboard/overviews/AnonymizerOverview";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case "admin":        return <AdminOverview />;
    case "commissioner": return <CommissionerOverview />;
    case "counter":      return <CounterOverview />;
    case "anonymizer":   return <AnonymizerOverview />;
    case "voter":
    default:             return <VoterOverview />;
  }
}
