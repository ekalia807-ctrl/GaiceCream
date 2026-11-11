import { formatMonthYear, formatShortDate } from "@/lib/format";
import { normalizeLocalPhone } from "@/lib/phone";
import type { CashTransaction, Order } from "@/types/admin";
import { daysInRange, type DateRange } from "./period";

/** Hanya pesanan berstatus "selesai" dihitung sebagai omzet. */
export const isSale = (order: Order) => order.status === "selesai";

export function inRange(time: number, range: DateRange) {
  return time >= range.from.getTime() && time <= range.to.getTime();
}

const orderTime = (order: Order) => new Date(order.createdAt).getTime();
/** tanggal transaksi (YYYY-MM-DD) dibaca sebagai tengah hari waktu lokal */
const transactionTime = (tx: CashTransaction) =>
  new Date(`${tx.date}T12:00:00`).getTime();

export const ordersInRange = (orders: Order[], range: DateRange) =>
  orders.filter((order) => inRange(orderTime(order), range));

export const transactionsInRange = (
  transactions: CashTransaction[],
  range: DateRange,
) => transactions.filter((tx) => inRange(transactionTime(tx), range));

const orderCost = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);

export type Summary = {
  /** jumlah pesanan masuk (tanpa yang dibatalkan) */
  orderCount: number;
  /** omzet dari penjualan (pesanan selesai) */
  revenue: number;
  /** modal barang terjual */
  cogs: number;
  expenses: number;
  otherIncome: number;
  /** omzet + pemasukan lain - modal - pengeluaran */
  profit: number;
  unitsSold: number;
};

export function summarize(
  orders: Order[],
  transactions: CashTransaction[],
  range: DateRange,
): Summary {
  const periodOrders = ordersInRange(orders, range);
  const sales = periodOrders.filter(isSale);
  const periodTx = transactionsInRange(transactions, range);

  const revenue = sales.reduce((sum, order) => sum + order.total, 0);
  const cogs = sales.reduce((sum, order) => sum + orderCost(order), 0);
  const expenses = periodTx
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const otherIncome = periodTx
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    orderCount: periodOrders.filter((order) => order.status !== "dibatalkan").length,
    revenue,
    cogs,
    expenses,
    otherIncome,
    profit: revenue + otherIncome - cogs - expenses,
    unitsSold: sales.reduce(
      (sum, order) => sum + order.items.reduce((n, item) => n + item.quantity, 0),
      0,
    ),
  };
}

/** Perubahan dalam persen; null jika periode pembanding bernilai 0. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export type SeriesPoint = {
  key: string;
  label: string;
  revenue: number;
  cogs: number;
  expenses: number;
  profit: number;
};

function dayKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Deret waktu per hari (rentang <= 31 hari) atau per bulan (lebih panjang). */
export function buildSeries(
  orders: Order[],
  transactions: CashTransaction[],
  range: DateRange,
): SeriesPoint[] {
  const monthly = daysInRange(range) > 31;
  const keyOf = monthly ? monthKey : dayKey;
  const labelOf = monthly ? formatMonthYear : formatShortDate;

  const buckets = new Map<string, SeriesPoint>();
  const cursor = new Date(
    range.from.getFullYear(),
    range.from.getMonth(),
    monthly ? 1 : range.from.getDate(),
  );
  while (cursor <= range.to) {
    buckets.set(keyOf(cursor), {
      key: keyOf(cursor),
      label: labelOf(cursor),
      revenue: 0,
      cogs: 0,
      expenses: 0,
      profit: 0,
    });
    if (monthly) cursor.setMonth(cursor.getMonth() + 1);
    else cursor.setDate(cursor.getDate() + 1);
  }

  ordersInRange(orders, range)
    .filter(isSale)
    .forEach((order) => {
      const bucket = buckets.get(keyOf(new Date(order.createdAt)));
      if (!bucket) return;
      bucket.revenue += order.total;
      bucket.cogs += orderCost(order);
      bucket.profit += order.total - orderCost(order);
    });

  transactionsInRange(transactions, range).forEach((tx) => {
    const bucket = buckets.get(keyOf(new Date(`${tx.date}T12:00:00`)));
    if (!bucket) return;
    if (tx.type === "expense") {
      bucket.expenses += tx.amount;
      bucket.profit -= tx.amount;
    } else {
      bucket.profit += tx.amount;
    }
  });

  return Array.from(buckets.values());
}

export type ProductPerformance = {
  key: string;
  productId: string;
  name: string;
  units: number;
  revenue: number;
  profit: number;
};

export function productPerformance(
  orders: Order[],
  range: DateRange,
): ProductPerformance[] {
  const map = new Map<string, ProductPerformance>();
  ordersInRange(orders, range)
    .filter(isSale)
    .forEach((order) => {
      order.items.forEach((item) => {
        const entry = map.get(item.productId) ?? {
          key: item.productId,
          productId: item.productId,
          name: item.name,
          units: 0,
          revenue: 0,
          profit: 0,
        };
        entry.units += item.quantity;
        entry.revenue += item.price * item.quantity;
        entry.profit += (item.price - item.cost) * item.quantity;
        map.set(item.productId, entry);
      });
    });
  return Array.from(map.values()).sort((a, b) => b.units - a.units);
}

export type CustomerSummary = {
  key: string;
  name: string;
  whatsapp: string;
  orderCount: number;
  totalSpent: number;
  firstOrderAt: string;
  lastOrderAt: string;
};

/** Pelanggan dikelompokkan dari nomor WhatsApp pada pesanan (tanpa yang dibatalkan). */
export function customersFromOrders(orders: Order[]): CustomerSummary[] {
  const map = new Map<string, CustomerSummary>();
  [...orders]
    .filter((order) => order.status !== "dibatalkan")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .forEach((order) => {
      const key = normalizeLocalPhone(order.whatsapp);
      const entry = map.get(key);
      if (!entry) {
        map.set(key, {
          key,
          name: order.customerName,
          whatsapp: order.whatsapp,
          orderCount: 1,
          totalSpent: order.status === "selesai" ? order.total : 0,
          firstOrderAt: order.createdAt,
          lastOrderAt: order.createdAt,
        });
        return;
      }
      entry.name = order.customerName; // pakai nama terbaru
      entry.orderCount += 1;
      if (order.status === "selesai") entry.totalSpent += order.total;
      entry.lastOrderAt = order.createdAt;
    });
  return Array.from(map.values()).sort((a, b) =>
    b.lastOrderAt.localeCompare(a.lastOrderAt),
  );
}
