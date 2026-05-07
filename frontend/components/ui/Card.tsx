import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "glass" | "solid" | "bordered";
  glow?: boolean;
};

export function Card({ className, variant = "glass", glow = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-300",
        variant === "glass" && "glass",
        variant === "solid" && "bg-ink-800 border border-white/[.06] shadow-card",
        variant === "bordered" && "bg-ink-900/60 backdrop-blur-md border border-primary-500/20",
        glow && "shadow-glow",
        className,
      )}
      {...rest}
    />
  );
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-3", className)} {...rest} />;
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-semibold tracking-tight text-white", className)}
      {...rest}
    />
  );
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1.5 text-sm text-slate-400", className)} {...rest} />
  );
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-4", className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-3 p-6 pt-0", className)}
      {...rest}
    />
  );
}
