"use client";

import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminOrders } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { usePeriod } from "@/hooks/usePeriod";
import { ordersInRange } from "@/lib/admin/analytics";
import { exportOrdersToExcel } from "@/lib/admin/export";
import { formatRange, periodOptionsWithAll } from "@/lib/admin/period";
import { updateOrderStatus } from "@/lib/admin/repository";
import { orderStatusLabel, orderStatuses } from "@/lib/admin/status";
import type { Order, OrderStatus } from "@/types/admin";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { OrderDetailModal } from "../OrderDetailModal";
import { OrderTable } from "../OrderTable";
import { Panel } from "../Panel";
import { PeriodFilter } from "../PeriodFilter";
import { pillControl } from "../styles";
import { useToast } from "../ToastProvider";

export function OrdersView() {
  const ready = useAdminReady();
  const notify = useToast();
  const orders = useAdminOrders();
  const period = usePeriod("month");
  const [status, setStatus] = useState<"semua" | OrderStatus>("semua");
  const [query, setQuery] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const periodLabel = period.preset === "all" ? "Semua waktu" : formatRange(period.range);

  const filtered = useMemo(() => {
    const base = period.preset === "all" ? orders : ordersInRange(orders, period.range);
    const keyword = query.trim().toLowerCase();
    return base
      .filter(
        (order) =>
          (status === "semua" || order.status === status) &&
          (keyword === "" ||
            order.orderNumber.toLowerCase().includes(keyword) ||
            order.customerName.toLowerCase().includes(keyword)),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, period.preset, period.range, status, query]);

  if (!ready) return <AdminLoading />;

  const detail = detailId ? orders.find((order) => order.id === detailId) : undefined;

  async function changeStatus(order: Order, next: OrderStatus) {
    try {
      await updateOrderStatus(order.id, next);
      notify(`#${order.orderNumber} sekarang ${orderStatusLabel[next]}`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Status gagal diubah");
    }
  }

  async function exportExcel() {
    setExporting(true);
    try {
      await exportOrdersToExcel(filtered, periodLabel);
      notify("Data pesanan berhasil diekspor");
    } catch {
      notify("Export gagal. Coba lagi.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <AdminTitle eyebrow="Kelola transaksi" title="Semua Pesanan">
        <PeriodFilter period={period} options={periodOptionsWithAll} />
      </AdminTitle>

      <div className="mb-[16px] flex flex-wrap justify-between gap-[10px] rounded-[15px] border border-[#eeeceb] bg-white p-[12px] max-[520px]:flex-col">
        <label className="flex w-[260px] items-center gap-[10px] rounded-full border border-[#e7e5e4] px-[13px] py-[8px] focus-within:border-strawberry-dark max-[520px]:w-full">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari ID atau pelanggan..."
            aria-label="Cari pesanan"
            className="w-full bg-transparent text-[12px] outline-none"
          />
        </label>
        <div className="flex gap-[7px] max-[520px]:justify-between">
          <select
            aria-label="Filter status"
            value={status}
            onChange={(event) => setStatus(event.target.value as "semua" | OrderStatus)}
            className={pillControl}
          >
            <option value="semua">Semua status</option>
            {orderStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={exportExcel} disabled={exporting || filtered.length === 0}>
            <Download size={16} strokeWidth={1.8} aria-hidden="true" />
            {exporting ? "Mengekspor..." : "Export Excel"}
          </Button>
        </div>
      </div>

      <Panel className="pb-[8px]">
        {filtered.length === 0 ? (
          <EmptyState>
            {orders.length === 0
              ? "Belum ada pesanan. Pesanan dari website akan muncul di sini."
              : "Tidak ada pesanan yang cocok dengan filter ini."}
          </EmptyState>
        ) : (
          <OrderTable orders={filtered} onOpen={(order) => setDetailId(order.id)} onStatusChange={changeStatus} />
        )}
      </Panel>

      {detail && (
        <OrderDetailModal
          order={detail}
          onClose={() => setDetailId(null)}
          onStatusChange={(next) => changeStatus(detail, next)}
        />
      )}
    </div>
  );
}
