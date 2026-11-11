export type OrderStatus =
  | "menunggu"
  | "diproses"
  | "siap_diambil"
  | "selesai"
  | "dibatalkan";

export type OrderItem = {
  productId: string;
  name: string;
  /** harga jual per pcs saat pesanan dibuat */
  price: number;
  /** modal per pcs saat pesanan dibuat */
  cost: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsapp: string;
  items: OrderItem[];
  deliveryMethod: "pickup" | "delivery";
  address?: string;
  notes?: string;
  status: OrderStatus;
  total: number;
  /** ISO datetime */
  createdAt: string;
  poPeriodId?: string | null;
};

export type CashTransaction = {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  /** tanggal transaksi, format YYYY-MM-DD */
  date: string;
  createdAt: string;
};

export type StoreSettings = {
  id: "store";
  ownerName: string;
  email: string;
  storeName: string;
  whatsapp: string;
  address: string;
  instagram: string;
  tiktok: string;
};

export type PoPeriod = {
  id: string;
  name: string;
  status: "open" | "closed";
  /** YYYY-MM-DD */
  readyDate: string | null;
  quota: number | null;
  note: string;
  openedAt: string;
  closedAt: string | null;
};
