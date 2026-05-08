import { type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: Props) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <Badge variant="primary" className="mb-3">{eyebrow}</Badge>}
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title.includes("|") ? (
            <>
              {title.split("|")[0]}
              <span className="text-gradient">{title.split("|")[1]}</span>
            </>
          ) : (
            title
          )}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
