"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  secret?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, secret, className, id, type, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [revealed, setRevealed] = useState(false);
  const [focused, setFocused] = useState(false);

  const effectiveType = secret ? (revealed ? "text" : "password") : type ?? "text";

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400"
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "group relative rounded-xl transition-all duration-300",
          "bg-ink-800/80 backdrop-blur-md",
          "border",
          error
            ? "border-neon-red/60 shadow-glow-red"
            : focused
              ? "border-primary-400/60 shadow-glow-sm"
              : "border-white/10 hover:border-white/20",
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          className={cn(
            "block w-full bg-transparent px-4 py-3 text-sm font-mono tracking-wide text-white placeholder:text-slate-500",
            "focus:outline-none rounded-xl",
            secret && "pr-11",
            className,
          )}
          {...rest}
        />

        {secret && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((r) => !r)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-primary-300 transition-colors"
            aria-label={revealed ? "Hide value" : "Show value"}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-neon-red animate-fade-in flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-neon-red animate-pulse" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
