"use client";

import {
  orderStatuses,
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/admin/status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/admin";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-[8px] py-[5px] text-[9px] font-semibold",
        orderStatusStyle[status],
      )}
    >
      {orderStatusLabel[status]}
    </span>
  );
}

/** Pilihan status berbentuk badge: dipakai untuk mengubah status langsung dari tabel. */
export function OrderStatusSelect({
  value,
  onChange,
}: {
  value: OrderStatus;
  onChange: (next: OrderStatus) => void;
}) {
  return (
    <select
      aria-label="Status pesanan"
      value={value}
      disabled={value === "dibatalkan"}
      onChange={(event) => onChange(event.target.value as OrderStatus)}
      className={cn(
        "cursor-pointer rounded-full border-0 px-[10px] py-[6px] text-[10px] font-semibold outline-none disabled:cursor-not-allowed",
        orderStatusStyle[value],
      )}
    >
      {orderStatuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}
