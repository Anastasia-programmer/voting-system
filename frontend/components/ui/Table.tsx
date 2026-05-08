import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[.06] bg-ink-900/40 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className={cn("w-full text-sm", className)} {...rest} />
      </div>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-white/[.02] text-[10px] uppercase tracking-[.2em] text-slate-500">
      {children}
    </thead>
  );
}

export function TR({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-t border-white/[.04] transition-colors hover:bg-white/[.02]",
        className,
      )}
      {...rest}
    />
  );
}

export function TH({ className, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 text-left font-semibold", className)} {...rest} />;
}

export function TD({ className, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 align-middle text-slate-300", className)} {...rest} />;
}

export function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-sm text-slate-500"
      >
        {label}
      </td>
    </tr>
  );
}
