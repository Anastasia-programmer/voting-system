"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "neon";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "btn-glow bg-primary-gradient bg-[length:200%_200%] text-white hover:bg-[length:300%_300%] focus-visible:ring-primary-400 shadow-glow-sm hover:shadow-glow",
  secondary:
    "bg-white/[.04] text-slate-100 border border-white/10 backdrop-blur-md hover:bg-white/[.08] hover:border-primary-400/40 focus-visible:ring-primary-400",
  ghost:
    "bg-transparent text-slate-300 hover:bg-white/[.04] hover:text-white focus-visible:ring-white/30",
  danger:
    "bg-danger-gradient text-white hover:shadow-glow-red focus-visible:ring-neon-red",
  neon:
    "bg-ink-800 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/10 hover:shadow-glow-cyan focus-visible:ring-neon-cyan",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-wide",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold uppercase tracking-wide",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      <span className="relative z-10 flex items-center gap-2 normal-case">{children}</span>
    </button>
  );
});
