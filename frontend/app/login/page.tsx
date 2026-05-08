"use client";

import Link from "next/link";
import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { HttpError } from "@/lib/api";

export default function LoginPage() {
  const { login, user, ready } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const { notify } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(params.get("next") || "/dashboard");
  }, [ready, user, router, params]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      notify({ kind: "success", title: "Signed in", description: "Welcome back." });
      router.replace(params.get("next") || "/dashboard");
    } catch (err) {
      const msg = err instanceof HttpError ? err.message : "Network error.";
      notify({ kind: "error", title: "Sign in failed", description: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your account credentials to enter the workspace."
      footer={
        <>
          <span className="text-slate-500">No account yet? </span>
          <Link href="/register" className="font-semibold text-primary-300 hover:text-primary-200">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          required
          autoComplete="current-password"
          secret
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" size="lg" className="w-full" loading={submitting}>
          <LogIn className="h-4 w-4" />
          Sign in
        </Button>
      </form>
    </AuthShell>
  );
}
