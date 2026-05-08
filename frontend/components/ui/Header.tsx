"use client";

import Link from "next/link";
import { ShieldCheck, Lock, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { user, ready, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/[.06] bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <span aria-hidden className="absolute inset-0 rounded-xl bg-primary-500/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient bg-[length:200%_200%] animate-gradient-shift shadow-glow-sm">
              <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-white">
              Secure<span className="text-gradient">Vote</span>
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[.22em] text-slate-500">
              Cryptographic Protocol
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1">
            {[
              { href: "/vote", label: "Vote" },
              { href: "/verify", label: "Verify" },
              { href: "/results", label: "Results" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[.04] hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth state */}
          {ready && (user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="secondary" size="sm">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="flex items-center gap-2 rounded-lg border border-white/[.06] bg-ink-800/60 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-neon-red/40 hover:text-neon-red"
              >
                <span className="hidden sm:inline">{user.full_name?.split(" ")[0]}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-gradient text-[11px] font-bold text-white">
                  {(user.full_name?.[0] ?? "U").toUpperCase()}
                </span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[.06] bg-ink-950/60 backdrop-blur-md py-8 text-center text-xs text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-primary-400" />
          <span>SecureVote · RSA · Blind Signatures · Anonymizer</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[.22em] text-slate-600">
          Academic build — not for live elections
        </p>
      </div>
    </footer>
  );
}
