import type { OrderStatus } from "@/types/admin";

export const orderStatuses: { value: OrderStatus; label: string }[] = [
  { value: "menunggu", label: "Menunggu" },
  { value: "diproses", label: "Diproses" },
  { value: "siap_diambil", label: "Siap Diambil" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  siap_diambil: "Siap Diambil",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

/** kelas warna badge status (dari desain Figma) */
export const orderStatusStyle: Record<OrderStatus, string> = {
  menunggu: "bg-[#fff1ce] text-[#916c19]",
  diproses: "bg-[#e8e2f2] text-[#745d92]",
  siap_diambil: "bg-[#e3efdf] text-[#557a4b]",
  selesai: "bg-[#eeeae6] text-[#6e625e]",
  dibatalkan: "bg-[#f9e3df] text-[#a8493a]",
};

export const LOW_STOCK_THRESHOLD = 5;

export const expenseCategories = [
  "Bahan Baku",
  "Kemasan",
  "Operasional",
  "Transportasi",
  "Lainnya",
] as const;

export const incomeCategories = ["Penjualan Lain", "Lainnya"] as const;
