"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" } as const;

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full glass-strong rounded-2xl animate-fade-in",
          sizes[size],
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-slate-400 hover:bg-white/[.04] hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {(title || description) && (
          <div className="border-b border-white/[.06] p-6 pb-4 pr-12">
            {title && <h2 className="text-lg font-semibold tracking-tight text-white">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-white/[.06] p-6 pt-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
