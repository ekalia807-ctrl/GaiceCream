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
        "mb-[18px] flex items-center gap-[9px] text-[11px] font-extrabold uppercase tracking-[2.2px] text-biscuit",
        centered && "justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
}
