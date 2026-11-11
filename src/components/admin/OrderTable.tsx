"use client";

import { formatDateTime } from "@/lib/format";
import { formatIDR } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/admin";
import { EmptyState } from "./EmptyState";
import { OrderStatusSelect, StatusBadge } from "./StatusBadge";

const th =
  "border-b border-[#eee2da] px-[10px] py-[14px] text-left text-[9px] tracking-[.5px] text-[#a0857c]";
const td = "border-b border-[#f3e9e3] px-[10px] py-[14px] text-[11px]";

export function OrderTable({
  orders,
  compact = false,
  onOpen,
  onStatusChange,
}: {
  orders: Order[];
  /** true: tanpa pengubah status (untuk Ringkasan) */
  compact?: boolean;
  onOpen?: (order: Order) => void;
  onStatusChange?: (order: Order, status: OrderStatus) => void;
}) {
  if (orders.length === 0) {
    return <EmptyState>Belum ada pesanan.</EmptyState>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px] border-collapse">
        <thead>
          <tr>
            <th className={th}>ID PESANAN</th>
            <th className={th}>PELANGGAN</th>
            <th className={th}>PRODUK</th>
            <th className={th}>TOTAL</th>
            <th className={th}>STATUS</th>
            {onOpen && <th className={th} />}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className={td}>
                <b className="block">#{order.orderNumber}</b>
                <small className="text-[9px] text-muted">{formatDateTime(order.createdAt)}</small>
              </td>
              <td className={td}>{order.customerName}</td>
              <td className={td}>
                {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}
              </td>
              <td className={td}>
                <b>{formatIDR(order.total)}</b>
              </td>
              <td className={td}>
                {compact || !onStatusChange ? (
                  <StatusBadge status={order.status} />
                ) : (
                  <OrderStatusSelect
                    value={order.status}
                    onChange={(status) => onStatusChange(order, status)}
                  />
                )}
              </td>
              {onOpen && (
                <td className={td}>
                  <button
                    type="button"
                    onClick={() => onOpen(order)}
                    className="rounded-[8px] bg-[#fff1f5] px-[9px] py-[6px] text-[10px] text-[#b15f78]"
                  >
                    Detail
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
