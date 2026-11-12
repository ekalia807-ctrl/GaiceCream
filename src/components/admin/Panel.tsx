import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-[17px] border border-[#eeeceb] bg-white p-[21px]", className)}
    >
      {children}
    </section>
  );
}

export function PanelTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-[10px]">
      <div>
        <h3 className="mb-[3px] text-[14px]">{title}</h3>
        {subtitle && <span className="text-[10px] text-muted">{subtitle}</span>}
      </div>
      {action}
    </div>
  );
}
