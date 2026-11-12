import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  positive: "bg-[#e8f3e9] text-[#4f9a62]",
  neutral: "bg-[#f4eee9] text-muted",
  warning: "bg-[#f7e9df] text-[#ae694f]",
  purple: "bg-[#ede7f2] text-[#8b719c]",
} as const;

export type StatTone = keyof typeof tones;

export function StatCard({
  label,
  value,
  note,
  tone = "positive",
  icon,
  iconClassName,
}: {
  label: string;
  value: string;
  note?: string;
  tone?: StatTone;
  icon?: ReactNode;
  iconClassName?: string;
}) {
  return (
    <article className="relative rounded-[17px] border border-[#eeeceb] bg-white p-[19px]">
      {icon && (
        <div
          className={cn(
            "absolute right-[16px] top-[16px] grid h-[37px] w-[37px] place-items-center rounded-[10px]",
            iconClassName,
          )}
        >
          {icon}
        </div>
      )}
      <span className="text-[11px] text-muted">{label}</span>
      <h2 className="my-[8px] text-[22px]">{value}</h2>
      {note && (
        <small className={cn("rounded-full px-[7px] py-[4px] text-[9px]", tones[tone])}>
          {note}
        </small>
      )}
    </article>
  );
}

const gridVariants = {
  four: "grid-cols-4 max-[800px]:grid-cols-2 max-[520px]:grid-cols-1",
  three: "grid-cols-3 max-[520px]:grid-cols-1",
  /** halaman keuangan: tetap 2 kolom di layar kecil (sesuai desain) */
  finance: "grid-cols-4 max-[800px]:grid-cols-2",
} as const;

export function StatGrid({
  children,
  variant = "four",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof gridVariants;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-[16px]", gridVariants[variant], className)}>
      {children}
    </section>
  );
}
