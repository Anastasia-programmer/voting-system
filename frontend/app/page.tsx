import Link from "next/link";
import {
  ShieldCheck,
  Eye,
  KeyRound,
  Fingerprint,
  ArrowRight,
  Lock,
  Sparkles,
  Network,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    icon: KeyRound,
    title: "Two-code identity",
    body: "N1 proves eligibility, N2 confirms intent. Neither is ever stored in plaintext.",
    accent: "from-primary-500 to-violet-500",
  },
  {
    icon: Fingerprint,
    title: "Blind signatures",
    body: "The administrator signs your ballot without ever seeing its content.",
    accent: "from-violet-500 to-neon-cyan",
  },
  {
    icon: Network,
    title: "Anonymizer routing",
    body: "Your ballot is detached from your identity before it reaches the counter.",
    accent: "from-neon-cyan to-primary-500",
  },
  {
    icon: Lock,
    title: "End-to-end encryption",
    body: "Votes stay encrypted in storage; only the counter authority can tally.",
    accent: "from-primary-400 to-violet-600",
  },
];

const steps = [
  { n: "01", t: "Identify with N1", d: "Prove you are an eligible voter without exposing identity.", icon: Fingerprint },
  { n: "02", t: "Cast your choice", d: "Pick a candidate. The selection is encrypted client-side.", icon: Eye },
  { n: "03", t: "Confirm with N2",  d: "Authorize the ballot using a hashed confirmation token.", icon: Lock },
  { n: "04", t: "Secure submission", d: "Sign · anonymize · store. Receive a cryptographic receipt.", icon: ShieldCheck },
];

const stats = [
  { v: "2048-bit", l: "RSA key length" },
  { v: "100%",     l: "End-to-end encrypted" },
  { v: "0",        l: "Identity-vote linkage" },
  { v: "Zero",     l: "Plaintext at rest" },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-7 animate-fade-in">
              <Badge variant="primary" className="backdrop-blur">
                <Sparkles className="h-3 w-3" />
                Cryptographic protocol · v1.0
              </Badge>

              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Vote with</span>
                <span className="block">
                  <span className="text-gradient bg-[length:200%_200%] animate-gradient-shift">
                    mathematical
                  </span>
                </span>
                <span className="block text-white">certainty.</span>
              </h1>

              <p className="max-w-xl text-base text-slate-400 sm:text-lg">
                SecureVote combines{" "}
                <span className="text-white">RSA encryption</span>,{" "}
                <span className="text-white">blind signatures</span>, and an{" "}
                <span className="text-white">anonymizer</span> so that your ballot is
                verifiable, untraceable, and counted exactly once.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/vote">
                  <Button size="lg">
                    Start voting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button size="lg" variant="secondary">
                    Verify a vote
                  </Button>
                </Link>
              </div>

              {/* live indicator */}
              <div className="flex items-center gap-3 pt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
                  </span>
                  <span className="font-mono uppercase tracking-[.18em] text-neon-green">
                    System operational
                  </span>
                </span>
                <span className="text-slate-700">·</span>
                <span className="font-mono uppercase tracking-[.18em]">
                  Anonymizer online
                </span>
              </div>
            </div>

            {/* HERO TERMINAL CARD */}
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[3rem] bg-primary-gradient opacity-20 blur-3xl"
              />
              <div className="gradient-border rounded-2xl">
                <Card variant="glass" className="relative overflow-hidden">
                  <div className="absolute inset-0 grid-backdrop opacity-40 pointer-events-none" aria-hidden />
                  <div className="relative">
                    {/* Terminal header */}
                    <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-neon-red/60" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neon-amber/60" />
                        <span className="h-2.5 w-2.5 rounded-full bg-neon-green/60" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[.22em] text-slate-500">
                        secure-channel.tls
                      </span>
                      <Cpu className="h-3.5 w-3.5 text-primary-400" />
                    </div>

                    <div className="space-y-2.5 px-5 py-5 font-mono text-xs leading-relaxed">
                      <p className="text-slate-500">$ initiating secure session…</p>
                      <p className="text-neon-green">✓ TLS handshake complete</p>
                      <p className="text-neon-green">✓ Voter eligibility verified</p>
                      <p className="text-neon-cyan">→ ballot.blind() <span className="text-slate-600">// hide payload</span></p>
                      <p className="text-violet-400">→ admin.sign(blinded) <span className="text-slate-600">// blind sig</span></p>
                      <p className="text-primary-300">→ anonymizer.route() <span className="text-slate-600">// strip identity</span></p>
                      <p className="text-neon-green">✓ vote.encrypted_store</p>
                      <p className="text-white">
                        receipt: <span className="text-primary-300">0x7f2a…b91c</span>
                        <span className="ml-1 inline-block h-3 w-1.5 align-middle bg-primary-400 animate-blink" />
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* floating chip */}
              <div className="absolute -bottom-5 -right-5 hidden sm:block animate-float">
                <Card variant="solid" className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-gradient shadow-glow-green">
                      <CheckCircle2 className="h-4 w-4 text-ink-950" strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[.18em] text-slate-500">Verified</p>
                      <p className="text-xs font-semibold text-white">Receipt issued</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.l}
                className="group rounded-xl border border-white/[.06] bg-white/[.02] backdrop-blur-md p-4 transition-all hover:border-primary-400/30 hover:-translate-y-0.5"
              >
                <p className="font-mono text-xl font-bold text-white sm:text-2xl">
                  <span className="text-gradient">{s.v}</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[.22em] text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12 text-center">
            <Badge variant="violet" className="mx-auto">Protocol flow</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Four steps. <span className="text-gradient">Zero compromise.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
              The cryptography happens transparently — your interaction stays simple.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.n} className="relative">
                  <Card
                    variant="glass"
                    className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-[.22em] text-slate-500">
                          Step {s.n}
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 ring-1 ring-white/10 transition-all group-hover:ring-primary-400/40 group-hover:bg-primary-500/10">
                          <Icon className="h-4 w-4 text-primary-300" />
                        </span>
                      </div>
                      <h3 className="mt-5 text-base font-semibold text-white">{s.t}</h3>
                      <p className="mt-1.5 text-sm text-slate-400">{s.d}</p>
                    </CardContent>
                  </Card>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute right-[-10px] top-1/2 hidden h-px w-5 -translate-y-1/2 bg-gradient-to-r from-primary-500/60 to-transparent lg:block"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mb-12">
            <Badge variant="cyan">Security primitives</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built on proven cryptography.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Every guarantee below is enforced by mathematics, not policy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} variant="glass" className="group transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                  <CardContent className="flex items-start gap-5 p-6">
                    <div className="relative">
                      <span
                        aria-hidden
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.accent} opacity-40 blur-md group-hover:opacity-70 transition-opacity`}
                      />
                      <span className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} shadow-glow-sm`}>
                        <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{f.title}</h3>
                      <p className="mt-1.5 text-sm text-slate-400">{f.body}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-20">
          <div className="gradient-border rounded-2xl">
            <Card variant="glass" className="relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(600px 200px at 30% 50%, rgba(59,80,255,.18), transparent 60%), radial-gradient(500px 200px at 80% 50%, rgba(139,92,246,.18), transparent 60%)",
                }}
              />
              <CardContent className="relative flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
                <div>
                  <Badge variant="primary">Ready</Badge>
                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Cast your ballot in under a minute.
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Guided · encrypted · anonymous · verifiable.
                  </p>
                </div>
                <Link href="/vote">
                  <Button size="lg">
                    Begin voting
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
