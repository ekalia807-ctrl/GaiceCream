/**
 * Akses data admin ke Supabase. Semua halaman admin memakai store ini.
 * Operasi yang melibatkan aturan bisnis (status pesanan, PO) memakai fungsi
 * database (RPC) supaya tetap aman dan konsisten.
 */
import { refreshPublicData } from "@/app/actions/revalidate";
import { createClient } from "@/lib/supabase/client";
import { createRemoteCollection } from "@/lib/supabase/collection";
import {
  orderFromRow,
  poFromRow,
  productFromRow,
  productToRow,
  settingsFromRow,
  settingsToRow,
  transactionFromRow,
  transactionToRow,
} from "@/lib/supabase/mappers";
import type {
  CashTransaction,
  Order,
  OrderStatus,
  PoPeriod,
  StoreSettings,
} from "@/types/admin";
import type { Product } from "@/types/product";

export const defaultSettings: StoreSettings = {
  id: "store",
  ownerName: "",
  email: "",
  storeName: "GAICREAM",
  whatsapp: "082146376899",
  address: "",
  instagram: "https://www.instagram.com/gaicream.id",
  tiktok: "",
};

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const productsStore = createRemoteCollection<Product>({
  table: "products",
  orderBy: [{ column: "sort_order" }, { column: "created_at" }],
  fromRow: productFromRow,
  toRow: productToRow,
  onPersisted: () => void refreshPublicData(),
});

// Pesanan hanya diubah lewat fungsi database (lihat updateOrderStatus).
export const ordersStore = createRemoteCollection<Order>({
  table: "orders",
  select: "*, order_items(*)",
  orderBy: [{ column: "created_at", ascending: false }],
  fromRow: orderFromRow,
  toRow: () => ({}),
});

export const transactionsStore = createRemoteCollection<CashTransaction>({
  table: "cash_transactions",
  orderBy: [{ column: "date", ascending: false }, { column: "created_at", ascending: false }],
  fromRow: transactionFromRow,
  toRow: transactionToRow,
});

export const settingsStore = createRemoteCollection<StoreSettings>({
  table: "store_settings",
  fromRow: settingsFromRow,
  toRow: settingsToRow,
  onPersisted: () => void refreshPublicData(),
});

export const poStore = createRemoteCollection<PoPeriod>({
  table: "po_periods",
  orderBy: [{ column: "opened_at", ascending: false }],
  fromRow: poFromRow,
  toRow: () => ({}),
});

/**
 * Mengubah status pesanan. Tampilan diperbarui langsung (optimistic), lalu disimpan ke database.
 * Jika gagal, status dikembalikan dan error dilempar. Pembatalan mengembalikan stok dan bersifat final.
 */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  const previous = ordersStore.getSnapshot().find((order) => order.id === id)?.status;
  ordersStore.patch(id, { status });
  const { error } = await createClient().rpc("set_order_status", {
    p_order_id: id,
    p_status: status,
  });
  if (error) {
    if (previous) ordersStore.patch(id, { status: previous });
    void ordersStore.refresh();
    throw new Error(error.message);
  }
  // pembatalan mengembalikan stok; kuota PO dan stok publik ikut berubah (di latar belakang)
  if (status === "dibatalkan") void productsStore.refresh();
  void refreshPublicData();
}

/** Membuka PO baru. PO yang masih terbuka otomatis ditutup. */
export async function openPo(input: {
  name: string;
  readyDate: string | null;
  quota: number | null;
  note: string;
}) {
  const { error } = await createClient().rpc("open_po", {
    p_name: input.name,
    p_ready_date: input.readyDate,
    p_quota: input.quota,
    p_note: input.note,
  });
  if (error) throw new Error(error.message);
  await poStore.refresh();
  void refreshPublicData();
}

export async function closePo(id: string) {
  const { error } = await createClient().rpc("close_po", { p_id: id });
  if (error) throw new Error(error.message);
  await poStore.refresh();
  void refreshPublicData();
}
