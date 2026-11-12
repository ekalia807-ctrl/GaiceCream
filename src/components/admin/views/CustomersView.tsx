"use client";

import { MessageCircle, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useAdminOrders } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { customersFromOrders } from "@/lib/admin/analytics";
import { formatDateTime } from "@/lib/format";
import { toInternationalPhone } from "@/lib/phone";
import { formatIDR } from "@/lib/utils";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { Panel } from "../Panel";
import { StatCard, StatGrid } from "../StatCard";

const th = "border-b border-[#eeeceb] px-[10px] py-[14px] text-left text-[9px] tracking-[.5px] text-[#a8a29e]";
const td = "border-b border-[#f5f5f4] px-[10px] py-[14px] text-[11px]";

export function CustomersView() {
  const ready = useAdminReady();
  const orders = useAdminOrders();
  const [query, setQuery] = useState("");

  const customers = useMemo(() => customersFromOrders(orders), [orders]);
  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(keyword) || customer.whatsapp.includes(keyword),
    );
  }, [customers, query]);

  if (!ready) return <AdminLoading />;

  const repeat = customers.filter((customer) => customer.orderCount >= 2).length;

  return (
    <div>
      <AdminTitle eyebrow="Data pelanggan dari pesanan" title="Pelanggan" />

      <StatGrid variant="three" className="mb-[16px]">
        <StatCard
          label="Total pelanggan"
          value={String(customers.length)}
          icon={<Users size={20} strokeWidth={1.8} aria-hidden="true" />}
          iconClassName="bg-[#e7e0ef]"
        />
        <StatCard label="Pelanggan berulang" value={String(repeat)} note="Pesan 2 kali atau lebih" tone="neutral" />
        <StatCard
          label="Rata-rata pesanan"
          value={customers.length > 0 ? (customers.reduce((n, c) => n + c.orderCount, 0) / customers.length).toFixed(1).replace(".", ",") : "0"}
          note="per pelanggan"
          tone="neutral"
        />
      </StatGrid>

      <div className="mb-[16px] rounded-[15px] border border-[#eeeceb] bg-white p-[12px]">
        <label className="flex w-[260px] items-center gap-[10px] rounded-full border border-[#e7e5e4] px-[13px] py-[8px] focus-within:border-strawberry-dark max-[520px]:w-full">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau nomor..."
            aria-label="Cari pelanggan"
            className="w-full bg-transparent text-[12px] outline-none"
          />
        </label>
      </div>

      <Panel className="pb-[8px]">
        {visible.length === 0 ? (
          <EmptyState>
            {customers.length === 0
              ? "Belum ada pelanggan. Pelanggan muncul otomatis dari pesanan."
              : "Tidak ada pelanggan yang cocok."}
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse">
              <thead>
                <tr>
                  <th className={th}>PELANGGAN</th>
                  <th className={th}>WHATSAPP</th>
                  <th className={th}>PESANAN</th>
                  <th className={th}>TOTAL BELANJA</th>
                  <th className={th}>TERAKHIR PESAN</th>
                  <th className={th} />
                </tr>
              </thead>
              <tbody>
                {visible.map((customer) => (
                  <tr key={customer.key}>
                    <td className={td}>
                      <b>{customer.name}</b>
                    </td>
                    <td className={td}>{customer.whatsapp}</td>
                    <td className={td}>{customer.orderCount}</td>
                    <td className={td}>
                      <b>{formatIDR(customer.totalSpent)}</b>
                    </td>
                    <td className={td}>{formatDateTime(customer.lastOrderAt)}</td>
                    <td className={td}>
                      <a
                        href={`https://wa.me/${toInternationalPhone(customer.whatsapp)}?text=${encodeURIComponent(`Halo ${customer.name}, terima kasih sudah memesan di GAICREAM.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-[6px] rounded-[8px] bg-[#f0f4e8] px-[10px] py-[6px] text-[10px] text-[#557a4b]"
                      >
                        <MessageCircle size={14} strokeWidth={1.8} aria-hidden="true" />
                        Chat
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <p className="mt-[12px] text-[11px] text-muted">
        Total belanja hanya menghitung pesanan berstatus Selesai.
      </p>
    </div>
  );
}
