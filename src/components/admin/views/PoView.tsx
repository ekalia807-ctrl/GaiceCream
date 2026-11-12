"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useAdminOrders, usePoPeriods, useAdminReady } from "@/hooks/useAdminData";
import { closePo, openPo } from "@/lib/admin/repository";
import { formatDateTime, formatLongDateString } from "@/lib/format";
import { formatIDR } from "@/lib/utils";
import { poFormSchema, type PoFormValues } from "@/lib/validation/admin";
import type { PoPeriod } from "@/types/admin";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading, EmptyState } from "../EmptyState";
import { Panel, PanelTitle } from "../Panel";
import { adminError, adminInput, adminLabel } from "../styles";
import { useToast } from "../ToastProvider";

const th = "border-b border-[#eeeceb] px-[10px] py-[14px] text-left text-[9px] tracking-[.5px] text-[#a8a29e]";
const td = "border-b border-[#f5f5f4] px-[10px] py-[14px] text-[11px]";

export function PoView() {
  const ready = useAdminReady();
  const notify = useToast();
  const periods = usePoPeriods();
  const orders = useAdminOrders();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PoFormValues>({
    resolver: zodResolver(poFormSchema),
    defaultValues: { name: "", readyDate: "", quota: null, note: "" },
  });

  // ringkasan pesanan per PO (tanpa pesanan yang dibatalkan)
  const stats = useMemo(() => {
    const map = new Map<string, { orders: number; units: number; revenue: number }>();
    orders.forEach((order) => {
      if (!order.poPeriodId || order.status === "dibatalkan") return;
      const entry = map.get(order.poPeriodId) ?? { orders: 0, units: 0, revenue: 0 };
      entry.orders += 1;
      entry.units += order.items.reduce((sum, item) => sum + item.quantity, 0);
      if (order.status === "selesai") entry.revenue += order.total;
      map.set(order.poPeriodId, entry);
    });
    return map;
  }, [orders]);

  if (!ready) return <AdminLoading />;

  const open = periods.find((period) => period.status === "open");
  const emptyStats = { orders: 0, units: 0, revenue: 0 };
  const openStats = open ? (stats.get(open.id) ?? emptyStats) : emptyStats;

  const onSubmit = handleSubmit(async (values) => {
    if (open && !window.confirm(`${open.name} masih dibuka dan akan ditutup. Lanjutkan?`)) return;
    setBusy(true);
    try {
      await openPo({
        name: values.name,
        readyDate: values.readyDate || null,
        quota: values.quota,
        note: values.note,
      });
      notify(`${values.name} dibuka`);
      reset({ name: "", readyDate: "", quota: null, note: "" });
    } catch (error) {
      notify(error instanceof Error ? error.message : "PO gagal dibuka");
    } finally {
      setBusy(false);
    }
  });

  async function close(period: PoPeriod) {
    if (!window.confirm(`Tutup ${period.name}? Pelanggan tidak bisa memesan lagi.`)) return;
    setBusy(true);
    try {
      await closePo(period.id);
      notify(`${period.name} ditutup`);
    } catch (error) {
      notify(error instanceof Error ? error.message : "PO gagal ditutup");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <AdminTitle eyebrow="Sistem pre-order" title="Periode PO" />

      <div className="grid grid-cols-2 gap-[16px] max-[1050px]:grid-cols-1">
        <Panel>
          <PanelTitle title="PO Aktif" subtitle="Pelanggan hanya bisa memesan saat PO dibuka" />
          {open ? (
            <div className="mt-[16px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <h2 className="text-[22px]">{open.name}</h2>
                <span className="rounded-full bg-[#e3efdf] px-[9px] py-[5px] text-[10px] font-semibold text-[#557a4b]">
                  Dibuka
                </span>
              </div>
              <p className="mt-[6px] text-[12px] text-muted">
                {open.readyDate ? `Ready ${formatLongDateString(open.readyDate)}` : "Tanggal ready belum diisi"}
                {" · "}
                {open.quota !== null ? `Kuota ${open.quota} pcs` : "Tanpa batas kuota"}
              </p>
              <div className="my-[18px] grid grid-cols-3 gap-[10px] text-center">
                <div className="rounded-[12px] bg-[#f7f5f2] p-[12px]">
                  <b className="block font-heading text-[18px]">{openStats.orders}</b>
                  <small className="text-[10px] text-muted">pesanan</small>
                </div>
                <div className="rounded-[12px] bg-[#f7f5f2] p-[12px]">
                  <b className="block font-heading text-[18px]">
                    {openStats.units}
                    {open.quota !== null ? ` / ${open.quota}` : ""}
                  </b>
                  <small className="text-[10px] text-muted">pcs terpesan</small>
                </div>
                <div className="rounded-[12px] bg-[#f7f5f2] p-[12px]">
                  <b className="block font-heading text-[18px]">{formatIDR(openStats.revenue)}</b>
                  <small className="text-[10px] text-muted">omzet selesai</small>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled={busy} onClick={() => close(open)}>
                Tutup PO
              </Button>
            </div>
          ) : (
            <EmptyState>PO sedang ditutup. Buka PO baru lewat formulir di samping.</EmptyState>
          )}
        </Panel>

        <Panel>
          <PanelTitle title="Buka PO Baru" subtitle="PO yang masih dibuka akan otomatis ditutup" />
          <form onSubmit={onSubmit} noValidate>
            <label className={adminLabel}>
              Nama PO
              <input
                {...register("name")}
                placeholder={`PO ${periods.length + 1}`}
                aria-invalid={Boolean(errors.name)}
                className={adminInput}
              />
              {errors.name && <span className={adminError}>{errors.name.message}</span>}
            </label>
            <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
              <label className={adminLabel}>
                Tanggal ready
                <input {...register("readyDate")} type="date" className={adminInput} />
              </label>
              <label className={adminLabel}>
                Kuota (pcs, opsional)
                <input
                  {...register("quota", {
                    setValueAs: (value) => (value === "" || value == null ? null : Number(value)),
                  })}
                  type="number"
                  inputMode="numeric"
                  placeholder="Kosongkan jika tanpa batas"
                  aria-invalid={Boolean(errors.quota)}
                  className={adminInput}
                />
                {errors.quota && <span className={adminError}>{errors.quota.message}</span>}
              </label>
            </div>
            <label className={adminLabel}>
              Catatan untuk pelanggan (opsional)
              <textarea
                {...register("note")}
                rows={2}
                placeholder="Contoh: Gratis ongkir UNRAM, Gomong, dan Punia"
                className={`${adminInput} resize-y`}
              />
              {errors.note && <span className={adminError}>{errors.note.message}</span>}
            </label>
            <Button type="submit" full disabled={busy} className="mt-[18px]">
              {busy ? "Memproses..." : "Buka PO"}
            </Button>
          </form>
        </Panel>
      </div>

      <Panel className="mt-[16px] pb-[8px]">
        <PanelTitle title="Riwayat PO" subtitle="Rekap pesanan setiap periode" />
        {periods.length === 0 ? (
          <EmptyState>Belum ada PO.</EmptyState>
        ) : (
          <div className="mt-[10px] overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse">
              <thead>
                <tr>
                  <th className={th}>PO</th>
                  <th className={th}>STATUS</th>
                  <th className={th}>DIBUKA</th>
                  <th className={th}>READY</th>
                  <th className={th}>PESANAN</th>
                  <th className={th}>PCS</th>
                  <th className={th}>OMZET</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((period) => {
                  const entry = stats.get(period.id) ?? emptyStats;
                  return (
                    <tr key={period.id}>
                      <td className={td}>
                        <b>{period.name}</b>
                      </td>
                      <td className={td}>{period.status === "open" ? "Dibuka" : "Ditutup"}</td>
                      <td className={td}>{formatDateTime(period.openedAt)}</td>
                      <td className={td}>{period.readyDate ? formatLongDateString(period.readyDate) : "–"}</td>
                      <td className={td}>{entry.orders}</td>
                      <td className={td}>
                        {entry.units}
                        {period.quota !== null ? ` / ${period.quota}` : ""}
                      </td>
                      <td className={td}>
                        <b>{formatIDR(entry.revenue)}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
