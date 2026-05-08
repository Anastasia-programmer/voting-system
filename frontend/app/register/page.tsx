"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { HttpError } from "@/lib/api";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLES: { value: Role; label: string; sub: string }[] = [
  { value: "voter",        label: "Voter",        sub: "Cast & verify ballots" },
  { value: "admin",        label: "Administrator",sub: "Manage elections" },
  { value: "commissioner", label: "Commissioner", sub: "Oversee process"  },
  { value: "counter",      label: "Counter",      sub: "Tally results" },
];

export default function RegisterPage() {
  const { register, login } = useAuth();
  const router = useRouter();
  const { notify } = useToast();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("voter");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      notify({ kind: "error", title: "Password too short", description: "Use at least 6 characters." });
      return;
    }
    setSubmitting(true);
    try {
      await register({ full_name: fullName, email, password, role });
      await login({ email, password });
      notify({ kind: "success", title: "Account created" });
      router.replace("/dashboard");
    } catch (err) {
      const msg = err instanceof HttpError ? err.message : "Network error.";
      notify({ kind: "error", title: "Registration failed", description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose a role to get started — admins can promote others later."
      footer={
        <>
          <span className="text-slate-500">Already registered? </span>
          <Link href="/login" className="font-semibold text-primary-300 hover:text-primary-200">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
        <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <Input label="Password" required secret autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least 6 characters." />

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">Role</p>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => {
              const selected = r.value === role;
              return (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "rounded-lg border p-3 text-left transition-all",
                    selected
                      ? "border-primary-400/60 bg-primary-500/[.08] shadow-glow-sm"
                      : "border-white/[.06] bg-ink-800/40 hover:border-primary-400/30",
                  )}
                >
                  <p className={cn("text-sm font-semibold", selected ? "text-white" : "text-slate-200")}>{r.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{r.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          <UserPlus className="h-4 w-4" />
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
