"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
type Toast = { id: number; kind: ToastKind; title: string; description?: string };

type ToastContextValue = {
  notify: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback<ToastContextValue["notify"]>((t) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { ...t, id }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const kindStyles: Record<ToastKind, { ring: string; icon: string; glow: string }> = {
  success: { ring: "ring-neon-green/40", icon: "text-neon-green",  glow: "shadow-glow-green" },
  error:   { ring: "ring-neon-red/40",   icon: "text-neon-red",    glow: "shadow-glow-red" },
  info:    { ring: "ring-primary-400/40",icon: "text-primary-300", glow: "shadow-glow-sm" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const Icon =
    toast.kind === "success" ? CheckCircle2 :
    toast.kind === "error"   ? AlertTriangle :
    Info;

  const s = kindStyles[toast.kind];

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl bg-ink-800/90 p-4 backdrop-blur-xl",
        "ring-1 animate-slide-in",
        s.ring,
        s.glow,
      )}
    >
      {/* Animated accent stripe */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          toast.kind === "success" && "bg-success-gradient",
          toast.kind === "error"   && "bg-danger-gradient",
          toast.kind === "info"    && "bg-primary-gradient",
        )}
      />

      <Icon className={cn("relative z-10 mt-0.5 h-5 w-5 shrink-0", s.icon)} />

      <div className="relative z-10 flex-1">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-slate-400">{toast.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="relative z-10 rounded-md p-1 text-slate-500 hover:bg-white/[.05] hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
