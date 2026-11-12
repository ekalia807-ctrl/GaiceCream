"use client";

import { ArrowDownLeft, ArrowUpRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAdminTransactions } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { usePeriod } from "@/hooks/usePeriod";
import { transactionsInRange } from "@/lib/admin/analytics";
import { formatRange } from "@/lib/admin/period";
import { transactionsStore } from "@/lib/admin/repository";
import { formatMediumDate } from "@/lib/format";
import { cn, formatIDR } from "@/lib/utils";
import type { CashTransaction } from "@/types/admin";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { Panel, PanelTitle } from "../Panel";
import { PeriodFilter } from "../PeriodFilter";
import { StatCard, StatGrid } from "../StatCard";
import { TransactionFormModal } from "../TransactionFormModal";
import { useToast } from "../ToastProvider";

type Tab = "semua" | "income" | "expense";

const tabs: { value: Tab; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "income", label: "Pemasukan" },
  { value: "expense", label: "Pengeluaran" },
];

export function CashView() {
  const ready = useAdminReady();
  const notify = useToast();
  const transactions = useAdminTransactions();
  const period = usePeriod("month");
  const [tab, setTab] = useState<Tab>("semua");
  const [form, setForm] = useState<{ type: "income" | "expense"; transaction?: CashTransaction } | null>(null);

  const inPeriod = useMemo(
    () =>
      transactionsInRange(transactions, period.range).sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
      ),
    [transactions, period.range],
  );

  if (!ready) return <AdminLoading />;

  const expenses = inPeriod.filter((tx) => tx.type === "expense");
  const incomes = inPeriod.filter((tx) => tx.type === "income");
  const sum = (list: CashTransaction[]) => list.reduce((total, tx) => total + tx.amount, 0);

  const byCategory = new Map<string, number>();
  expenses.forEach((tx) => byCategory.set(tx.category, (byCategory.get(tx.category) ?? 0) + tx.amount));
  const biggest = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1])[0];

  const shown = inPeriod.filter((tx) => tab === "semua" || tx.type === tab);

  function remove(tx: CashTransaction) {
    if (window.confirm(`Hapus catatan "${tx.description}"?`)) {
      transactionsStore.remove(tx.id);
      notify("Catatan dihapus");
    }
  }

  return (
    <div>
      <AdminTitle eyebrow="Catat kas bisnis" title="Pemasukan & Pengeluaran">
        <div className="flex flex-wrap items-center gap-[8px]">
          <PeriodFilter period={period} />
          <Button size="sm" variant="secondary" onClick={() => setForm({ type: "income" })}>
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" /> Pemasukan
          </Button>
          <Button size="sm" onClick={() => setForm({ type: "expense" })}>
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" /> Pengeluaran
          </Button>
        </div>
      </AdminTitle>

      <StatGrid variant="three" className="mb-[16px]">
        <StatCard label="Total pengeluaran" value={formatIDR(sum(expenses))} note={`${expenses.length} transaksi`} tone="neutral" />
        <StatCard label="Pemasukan lain" value={formatIDR(sum(incomes))} note={`${incomes.length} transaksi`} tone="neutral" />
        <StatCard
          label="Kategori pengeluaran terbesar"
          value={biggest ? biggest[0] : "–"}
          note={biggest ? formatIDR(biggest[1]) : "Belum ada pengeluaran"}
          tone="neutral"
        />
      </StatGrid>

      <Panel>
        <PanelTitle title="Riwayat Kas" subtitle={`Periode ${formatRange(period.range)}`} />
        <div className="mt-[14px] flex gap-[7px] overflow-auto">
          {tabs.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={tab === item.value}
              onClick={() => setTab(item.value)}
              className={cn(
                "whitespace-nowrap rounded-full border px-[14px] py-[8px] text-[11px]",
                tab === item.value ? "border-chocolate bg-chocolate text-white" : "border-[#e7e5e4] bg-white text-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <EmptyState>Belum ada catatan pada periode ini.</EmptyState>
        ) : (
          <div className="mt-[10px]">
            {shown.map((tx) => (
              <div key={tx.id} className="flex items-center gap-[10px] border-b border-[#f1e6df] px-[5px] py-[13px]">
                <span
                  className={cn(
                    "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px]",
                    tx.type === "income" ? "bg-[#e7f1e3] text-[#5c8c50]" : "bg-[#f7e9df] text-[#a4664e]",
                  )}
                >
                  {tx.type === "income" ? (
                    <ArrowDownLeft size={18} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <b className="truncate text-[11px]">{tx.description}</b>
                  <small className="text-[9px] text-muted">
                    {formatMediumDate(new Date(`${tx.date}T12:00:00`))} • {tx.category}
                  </small>
                </div>
                <strong className={cn("text-[11px]", tx.type === "income" ? "text-[#5b965a]" : "text-[#ac6b53]")}>
                  {formatIDR(tx.amount)}
                </strong>
                <button
                  type="button"
                  aria-label="Edit catatan"
                  onClick={() => setForm({ type: tx.type, transaction: tx })}
                  className="text-muted"
                >
                  <Pencil size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <button type="button" aria-label="Hapus catatan" onClick={() => remove(tx)} className="text-[#b3412f]">
                  <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Panel>
      <p className="mt-[12px] text-[11px] text-muted">
        Penjualan dari pesanan Selesai otomatis masuk ke Laporan Keuangan, jadi tidak perlu dicatat di sini.
      </p>

      {form && (
        <TransactionFormModal
          key={form.transaction?.id ?? form.type}
          type={form.type}
          transaction={form.transaction}
          onClose={() => setForm(null)}
          onSaved={notify}
        />
      )}
    </div>
  );
}
