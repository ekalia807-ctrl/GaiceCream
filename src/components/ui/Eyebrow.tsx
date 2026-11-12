import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  centered = false,
  className,
}: {
  children: ReactNode;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-[14px] flex items-center gap-[9px] text-[11px] font-medium uppercase tracking-[.22em] text-muted",
        centered && "justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
