import Link from "next/link";
import { type ReactNode } from "react";
import { ShieldCheck, Lock, Fingerprint, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const points = [
  { icon: Fingerprint, text: "Two-code identity verification (N1 + N2)" },
  { icon: Lock, text: "Blind RSA signatures protect your ballot" },
  { icon: Network, text: "Anonymizer severs identity-vote linkage" },
  { icon: ShieldCheck, text: "End-to-end encrypted from device to counter" },
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center">
      {/* Left — pitch */}
      <div className="hidden lg:block">
        <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.22em] text-slate-500 hover:text-primary-300">
          ← back to home
        </Link>
        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white">
          A voting platform built on <span className="text-gradient">mathematics</span>, not trust.
        </h1>
        <p className="mt-3 max-w-md text-sm text-slate-400">
          Sign in to access the cryptographic e-voting workspace tailored to your role.
        </p>
        <ul className="mt-8 space-y-3">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <li key={p.text} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300 ring-1 ring-primary-400/30">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span>{p.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right — form card */}
      <div>
        <div className="gradient-border rounded-2xl">
          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-7 sm:p-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
              </div>
              <div className="mt-6">{children}</div>
              {footer && <div className="mt-6 border-t border-white/[.06] pt-5 text-center text-sm">{footer}</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
