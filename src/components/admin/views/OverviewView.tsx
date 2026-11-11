"use client";

import { ArrowRight, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useAdminOrders, useAdminProducts, useAdminSettings, useAdminTransactions } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { usePeriod } from "@/hooks/usePeriod";
import {
  buildSeries,
  customersFromOrders,
  inRange,
  percentChange,
  productPerformance,
  summarize,
} from "@/lib/admin/analytics";
import { formatRange, previousRange } from "@/lib/admin/period";
import { formatChange } from "@/lib/format";
import { formatIDR } from "@/lib/utils";
import { AdminTitle } from "../AdminTitle";
import { EmptyState, AdminLoading } from "../EmptyState";
import { OrderTable } from "../OrderTable";
import { Panel, PanelTitle } from "../Panel";
import { PeriodFilter } from "../PeriodFilter";
import { StatCard, StatGrid, type StatTone } from "../StatCard";
import { RevenueChart } from "../charts/RevenueChart";

function changeNote(change: number | null): { note: string; tone: StatTone } {
  if (change === null) return { note: "Belum ada pembanding", tone: "neutral" };
  return { note: `${formatChange(change)} dari periode sebelumnya`, tone: change >= 0 ? "positive" : "warning" };
}

export function OverviewView() {
  const ready = useAdminReady();
  const orders = useAdminOrders();
  const transactions = useAdminTransactions();
  const products = useAdminProducts();
  const settings = useAdminSettings();
  const period = usePeriod("month");
  const { range } = period;

  const data = useMemo(() => {
    const current = summarize(orders, transactions, range);
    const previous = summarize(orders, transactions, previousRange(range));
    const customers = customersFromOrders(orders);
    return {
      current,
      previous,
      customerCount: customers.length,
      newCustomers: customers.filter((c) => inRange(new Date(c.firstOrderAt).getTime(), range)).length,
      series: buildSeries(orders, transactions, range),
      top: productPerformance(orders, range).slice(0, 4),
    };
  }, [orders, transactions, range]);

  const recent = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [orders],
  );

  if (!ready) return <AdminLoading />;

  const { current, previous } = data;
  const revenueChange = changeNote(percentChange(current.revenue, previous.revenue));
  const orderChange = changeNote(percentChange(current.orderCount, previous.orderCount));
  const activeProducts = products.filter((product) => product.active).length;
  const totalUnits = data.top.reduce((sum, item) => sum + item.units, 0);
  const firstName = settings?.ownerName.split(" ")[0];

  return (
    <div>
      <AdminTitle
        eyebrow={`Selamat datang kembali${firstName ? `, ${firstName}` : ""}`}
        title="Ringkasan Bisnis"
      >
        <PeriodFilter period={period} />
      </AdminTitle>

      <StatGrid>
        <StatCard
          label="Total Pendapatan"
          value={formatIDR(current.revenue)}
          {...revenueChange}
          icon={<Wallet size={20} strokeWidth={1.8} aria-hidden="true" />}
          iconClassName="bg-[#fae0e7]"
        />
        <StatCard
          label="Total Pesanan"
          value={String(current.orderCount)}
          {...orderChange}
          icon={<ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />}
          iconClassName="bg-[#fff1ce]"
        />
        <StatCard
          label="Total Produk"
          value={`${activeProducts} rasa`}
          note={activeProducts === products.length ? "Semua aktif" : `${products.length - activeProducts} nonaktif`}
          tone="neutral"
          icon={<Package size={20} strokeWidth={1.8} aria-hidden="true" />}
          iconClassName="bg-[#e8eddd]"
        />
        <StatCard
          label="Total Pelanggan"
          value={String(data.customerCount)}
          note={`+${data.newCustomers} baru`}
          tone={data.newCustomers > 0 ? "positive" : "neutral"}
          icon={<Users size={20} strokeWidth={1.8} aria-hidden="true" />}
          iconClassName="bg-[#e7e0ef]"
        />
      </StatGrid>

      <div className="mt-[16px] grid grid-cols-[1.65fr_1fr] gap-[16px] max-[800px]:grid-cols-1">
        <Panel>
          <PanelTitle
            title="Pendapatan"
            subtitle={`Periode ${formatRange(range)}`}
            action={
              <div className="flex items-center gap-[5px] text-[9px] text-muted">
                <i className="h-[7px] w-[7px] rounded-full bg-strawberry-dark" /> Pendapatan
              </div>
            }
          />
          <div className="my-[20px] font-heading text-[20px] font-extrabold">
            {formatIDR(current.revenue)}{" "}
            {revenueChange.tone !== "neutral" && (
              <small className="rounded-full bg-[#e9f4e9] px-[7px] py-[4px] text-[9px] text-[#589466]">
                {formatChange(percentChange(current.revenue, previous.revenue))}
              </small>
            )}
          </div>
          <RevenueChart data={data.series} />
        </Panel>

        <Panel>
          <PanelTitle
            title="Produk Terlaris"
            subtitle="Berdasarkan penjualan selesai"
            action={
              <Link href="/admin/produk" className="text-[10px] text-biscuit">
                Lihat semua
              </Link>
            }
          />
          {data.top.length === 0 ? (
            <EmptyState>Belum ada penjualan selesai pada periode ini.</EmptyState>
          ) : (
            data.top.map((item, index) => {
              const image = products.find((product) => product.id === item.productId)?.image;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-[9px] border-b border-[#f1e6df] py-[10px] last:border-0"
                >
                  <span className="text-[10px] text-muted">{index + 1}</span>
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="h-[38px] w-[38px] rounded-[9px] object-cover" />
                  ) : (
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-[9px] bg-vanilla text-[12px] font-extrabold">
                      {item.name.charAt(0)}
                    </span>
                  )}
                  <div className="flex flex-1 flex-col">
                    <b className="text-[11px]">{item.name}</b>
                    <small className="text-[9px] text-muted">{item.units} terjual</small>
                  </div>
                  <strong className="text-[10px] text-strawberry-dark">
                    {totalUnits > 0 ? Math.round((item.units / totalUnits) * 100) : 0}%
                  </strong>
                </div>
              );
            })
          )}
        </Panel>
      </div>

      <Panel className="mt-[16px] pb-[8px]">
        <PanelTitle
          title="Pesanan Terbaru"
          subtitle="Pesanan yang paling baru masuk"
          action={
            <Link href="/admin/pesanan" className="flex items-center gap-[5px] text-[10px] text-biscuit">
              Lihat semua <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          }
        />
        <OrderTable orders={recent} compact />
      </Panel>
    </div>
  );
}
