import { VoteFlow } from "@/components/vote/VoteFlow";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Vote — SecureVote" };

export default function VotePage() {
  return (
    <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <Badge variant="primary" className="mx-auto">
          <ShieldCheck className="h-3 w-3" />
          Encrypted session
        </Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Cast your <span className="text-gradient">secure</span> vote
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
          Identity is verified separately from your ballot. No observer — including the
          server itself — can link who you are to how you voted.
        </p>
      </div>

      <VoteFlow />
    </div>
  );
}
