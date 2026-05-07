import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[.3em] text-primary-300">
        Error · 404
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
        Page <span className="text-gradient">not found</span>
      </h1>
      <p className="mt-3 text-sm text-slate-400">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/" className="mt-7">
        <Button>Back home</Button>
      </Link>
    </div>
  );
}
