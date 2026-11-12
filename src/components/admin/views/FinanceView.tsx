"use client";

import { ArrowDownLeft, ArrowUpRight, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminOrders, useAdminTransactions } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { usePeriod } from "@/hooks/usePeriod";
import {
  buildSeries,
  isSale,
  ordersInRange,
  percentChange,
  productPerformance,
  summarize,
  transactionsInRange,
} from "@/lib/admin/analytics";
import { exportFinanceToExcel, exportFinanceToPdf, type FinanceReport, type LedgerRow } from "@/lib/admin/export";
import { formatRange, previousRange } from "@/lib/admin/period";
import { formatChange, formatMediumDate, formatPercent } from "@/lib/format";
import { cn, formatIDR } from "@/lib/utils";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { Panel, PanelTitle } from "../Panel";
import { PeriodFilter } from "../PeriodFilter";
import { StatCard, StatGrid, type StatTone } from "../StatCard";
import { CashflowChart, cashflowLegend } from "../charts/CashflowChart";
import { pillControl } from "../styles";
import { useToast } from "../ToastProvider";

type LedgerEntry = LedgerRow & { id: string };

function changeTone(change: number | null, goodWhenUp: boolean): { note: string; tone: StatTone } {
  if (change === null) return { note: "Belum ada pembanding", tone: "neutral" };
  const good = goodWhenUp ? change >= 0 : change <= 0;
  return { note: `${formatChange(change)} dari periode sebelumnya`, tone: good ? "positive" : "warning" };
}

export function FinanceView() {
  const ready = useAdminReady();
  const notify = useToast();
  const orders = useAdminOrders();
  const transactions = useAdminTransactions();
  const period = usePeriod("month");
  const { range } = period;
  const [ledgerFilter, setLedgerFilter] = useState<"semua" | "income" | "expense">("semua");
  const [ledgerLimit, setLedgerLimit] = useState(20);
  const [exporting, setExporting] = useState<"pdf" | "xlsx" | null>(null);

  const report = useMemo(() => {
    const summary = summarize(orders, transactions, range);
    const previous = summarize(orders, transactions, previousRange(range));
    const sales: LedgerEntry[] = ordersInRange(orders, range)
      .filter(isSale)
      .map((order) => ({
        id: order.id,
        date: new Date(order.createdAt),
        description: `Penjualan #${order.orderNumber}`,
        category: "Penjualan",
        type: "income" as const,
        amount: order.total,
      }));
    const manual: LedgerEntry[] = transactionsInRange(transactions, range).map((tx) => ({
      id: tx.id,
      date: new Date(`${tx.date}T12:00:00`),
      description: tx.description,
      category: tx.category,
      type: tx.type,
      amount: tx.amount,
    }));
    return {
      summary,
      previous,
      series: buildSeries(orders, transactions, range),
      products: productPerformance(orders, range),
      ledger: [...sales, ...manual].sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
  }, [orders, transactions, range]);

  if (!ready) return <AdminLoading />;

  const { summary, previous } = report;
  const income = summary.revenue + summary.otherIncome;
  const margin = income > 0 ? (summary.profit / income) * 100 : null;
  const cogsShare = summary.revenue > 0 ? (summary.cogs / summary.revenue) * 100 : null;
  const periodLabel = formatRange(range);

  const profitRanking = [...report.products].sort((a, b) => b.profit - a.profit).slice(0, 4);
  const maxProfit = Math.max(...profitRanking.map((item) => item.profit), 0);
  const totalProfit = report.products.reduce((sum, item) => sum + item.profit, 0);

  const shownLedger = report.ledger.filter((row) => ledgerFilter === "semua" || row.type === ledgerFilter);

  async function runExport(kind: "pdf" | "xlsx") {
    const data: FinanceReport = {
      periodLabel,
      summary,
      series: report.series,
      products: report.products,
      ledger: report.ledger,
    };
    setExporting(kind);
    try {
      if (kind === "pdf") await exportFinanceToPdf(data);
      else await exportFinanceToExcel(data);
      notify(kind === "pdf" ? "Laporan PDF berhasil dibuat" : "Laporan Excel berhasil dibuat");
    } catch {
      notify("Export gagal. Coba lagi.");
    } finally {
      setExporting(null);
    }
  }

  return (
    <div>
      <AdminTitle eyebrow="Performa keuangan" title="Laporan Keuangan">
        <div className="flex flex-wrap items-center gap-[8px]">
          <PeriodFilter period={period} />
          <Button size="sm" onClick={() => runExport("pdf")} disabled={exporting !== null}>
            <Download size={16} strokeWidth={1.8} aria-hidden="true" />
            {exporting === "pdf" ? "Membuat PDF..." : "PDF"}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => runExport("xlsx")} disabled={exporting !== null}>
            <Download size={16} strokeWidth={1.8} aria-hidden="true" />
            {exporting === "xlsx" ? "Membuat Excel..." : "Excel"}
          </Button>
        </div>
      </AdminTitle>

      <StatGrid variant="finance">
        <StatCard label="Omzet" value={formatIDR(summary.revenue)} {...changeTone(percentChange(summary.revenue, previous.revenue), true)} />
        <StatCard
          label="Modal Terjual"
          value={formatIDR(summary.cogs)}
          note={cogsShare === null ? "Belum ada penjualan" : `${formatPercent(cogsShare)} omzet`}
          tone="purple"
        />
        <StatCard label="Pengeluaran" value={formatIDR(summary.expenses)} {...changeTone(percentChange(summary.expenses, previous.expenses), false)} />
        <StatCard
          label="Keuntungan Bersih"
          value={formatIDR(summary.profit)}
          note={margin === null ? "Belum ada pemasukan" : `${formatPercent(margin)} margin`}
          tone={summary.profit >= 0 ? "positive" : "warning"}
        />
      </StatGrid>
      <p className="mt-[10px] text-[11px] text-muted">
        Omzet dihitung dari pesanan berstatus Selesai. Keuntungan bersih = omzet + pemasukan lain − modal − pengeluaran
        {summary.otherIncome > 0 ? ` (pemasukan lain periode ini ${formatIDR(summary.otherIncome)})` : ""}.
      </p>

      <div className="mt-[16px] grid grid-cols-[1.65fr_1fr] gap-[16px] max-[800px]:grid-cols-1">
        <Panel className="min-h-[310px]">
          <PanelTitle
            title="Arus Kas"
            subtitle={`Periode ${periodLabel}`}
            action={
              <div className="flex flex-wrap justify-end gap-x-[10px] gap-y-[3px] text-[9px] text-muted">
                {cashflowLegend.map((item) => (
                  <span key={item.label} className="flex items-center gap-[5px]">
                    <i
                      className="h-[7px] w-[7px] rounded-full"
                      style={{ background: item.color }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            }
          />
          <div className="mt-[20px]">
            <CashflowChart data={report.series} />
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Profit per Produk" subtitle="Kontribusi keuntungan" />
          {profitRanking.length === 0 ? (
            <EmptyState>Belum ada penjualan selesai pada periode ini.</EmptyState>
          ) : (
            profitRanking.map((item) => (
              <div key={item.key} className="my-[20px] grid grid-cols-[90px_1fr_36px] items-center gap-[8px]">
                <span className="truncate text-[10px]">{item.name}</span>
                <div className="h-[7px] rounded-[5px] bg-[#f5f5f4]">
                  <i
                    className="block h-full rounded-[5px] bg-strawberry-dark"
                    style={{ width: `${maxProfit > 0 ? Math.max(0, (item.profit / maxProfit) * 100) : 0}%` }}
                  />
                </div>
                <b className="text-[10px]">
                  {totalProfit > 0 ? Math.round((item.profit / totalProfit) * 100) : 0}%
                </b>
              </div>
            ))
          )}
          {report.products.some((item) => item.profit === item.revenue) && (
            <p className="text-[10px] text-muted">Isi modal per pcs di halaman Produk agar profit akurat.</p>
          )}
        </Panel>
      </div>

      <Panel className="mt-[16px]">
        <PanelTitle
          title="Riwayat Transaksi"
          subtitle="Penjualan selesai dan catatan kas manual"
          action={
            <select
              aria-label="Filter transaksi"
              value={ledgerFilter}
              onChange={(event) => {
                setLedgerFilter(event.target.value as "semua" | "income" | "expense");
                setLedgerLimit(20);
              }}
              className={cn(pillControl, "py-[6px] text-[11px]")}
            >
              <option value="semua">Semua transaksi</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          }
        />
        {shownLedger.length === 0 ? (
          <EmptyState>Belum ada transaksi pada periode ini.</EmptyState>
        ) : (
          <div className="mt-[10px]">
            {shownLedger.slice(0, ledgerLimit).map((row) => (
              <div key={`${row.type}-${row.id}`} className="flex items-center gap-[10px] border-b border-[#f1e6df] px-[5px] py-[13px]">
                <span
                  className={cn(
                    "grid h-[34px] w-[34px] place-items-center rounded-[10px]",
                    row.type === "income" ? "bg-[#e7f1e3] text-[#5c8c50]" : "bg-[#f7e9df] text-[#a4664e]",
                  )}
                >
                  {row.type === "income" ? (
                    <ArrowDownLeft size={18} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  )}
                </span>
                <div className="flex flex-1 flex-col">
                  <b className="text-[11px]">{row.description}</b>
                  <small className="text-[9px] text-muted">
                    {formatMediumDate(row.date)} • {row.category}
                  </small>
                </div>
                <strong className={cn("text-[11px]", row.type === "income" ? "text-[#5b965a]" : "text-[#ac6b53]")}>
                  {row.type === "income" ? "+ " : "− "}
                  {formatIDR(row.amount)}
                </strong>
              </div>
            ))}
            {shownLedger.length > ledgerLimit && (
              <button
                type="button"
                onClick={() => setLedgerLimit((value) => value + 20)}
                className="mx-auto mt-[14px] block text-[11px] font-bold text-biscuit"
              >
                Tampilkan lebih banyak
              </button>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}
