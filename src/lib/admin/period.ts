import { formatMediumDate } from "@/lib/format";

export type DateRange = { from: Date; to: Date };

export type PeriodPreset =
  | "today"
  | "7d"
  | "30d"
  | "month"
  | "last-month"
  | "custom"
  | "all";

export const periodOptions: { value: PeriodPreset; label: string }[] = [
  { value: "today", label: "Hari ini" },
  { value: "7d", label: "7 hari terakhir" },
  { value: "30d", label: "30 hari terakhir" },
  { value: "month", label: "Bulan ini" },
  { value: "last-month", label: "Bulan lalu" },
  { value: "custom", label: "Pilih tanggal" },
];

/** Opsi untuk halaman yang boleh menampilkan semua data (daftar pesanan). */
export const periodOptionsWithAll: { value: PeriodPreset; label: string }[] = [
  { value: "all", label: "Semua waktu" },
  ...periodOptions,
];

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

export function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** "2026-11-05" -> Date lokal (tanpa pergeseran zona waktu) */
export function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function toDateInput(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function resolvePeriod(
  preset: PeriodPreset,
  custom: { from: string; to: string },
  now: Date = new Date(),
): DateRange {
  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "7d":
      return { from: startOfDay(addDays(now, -6)), to: endOfDay(now) };
    case "30d":
      return { from: startOfDay(addDays(now, -29)), to: endOfDay(now) };
    case "last-month": {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: startOfDay(first), to: endOfDay(last) };
    }
    case "custom": {
      const from = parseDateInput(custom.from);
      const to = parseDateInput(custom.to);
      if (from && to && from <= to) {
        return { from: startOfDay(from), to: endOfDay(to) };
      }
      return resolvePeriod("month", custom, now);
    }
    case "all":
      return { from: new Date(2000, 0, 1), to: endOfDay(now) };
    case "month":
    default: {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: startOfDay(first), to: endOfDay(now) };
    }
  }
}

export function daysInRange(range: DateRange) {
  const ms = startOfDay(range.to).getTime() - startOfDay(range.from).getTime();
  return Math.round(ms / 86_400_000) + 1;
}

/** Rentang dengan panjang sama tepat sebelum rentang ini (untuk perbandingan %). */
export function previousRange(range: DateRange): DateRange {
  const days = daysInRange(range);
  const to = endOfDay(addDays(range.from, -1));
  const from = startOfDay(addDays(range.from, -days));
  return { from, to };
}

export function formatRange(range: DateRange) {
  const from = formatMediumDate(range.from);
  const to = formatMediumDate(range.to);
  return from === to ? from : `${from} – ${to}`;
}
