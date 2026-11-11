import type {
  CashTransaction,
  Order,
  OrderItem,
  OrderStatus,
  PoPeriod,
  StoreSettings,
} from "@/types/admin";
import type { Product } from "@/types/product";

export type Row = Record<string, unknown>;

const str = (value: unknown, fallback = "") =>
  value === null || value === undefined ? fallback : String(value);
const num = (value: unknown) => Number(value ?? 0);

/** Hanya sertakan field yang didefinisikan (untuk update sebagian). */
function pick(entries: [string, unknown][]) {
  const row: Row = {};
  for (const [key, value] of entries) {
    if (value !== undefined) row[key] = value;
  }
  return row;
}

export function productFromRow(row: Row): Product {
  return {
    id: str(row.id),
    name: str(row.name),
    category: str(row.category),
    price: num(row.price),
    cost: num(row.cost),
    stock: num(row.stock),
    image: str(row.image_url),
    tag: str(row.tag),
    color: str(row.color, "#F5B8C9"),
    description: str(row.description),
    active: Boolean(row.active),
    sortOrder: num(row.sort_order),
  };
}

export function productToRow(product: Partial<Product>): Row {
  return pick([
    ["id", product.id],
    ["name", product.name],
    ["category", product.category],
    ["price", product.price],
    ["cost", product.cost],
    ["stock", product.stock],
    ["image_url", product.image],
    ["tag", product.tag],
    ["color", product.color],
    ["description", product.description],
    ["active", product.active],
    ["sort_order", product.sortOrder],
  ]);
}

export function orderItemFromRow(row: Row): OrderItem {
  return {
    productId: str(row.product_id),
    name: str(row.name),
    price: num(row.price),
    cost: num(row.cost),
    quantity: num(row.quantity),
  };
}

export function orderFromRow(row: Row): Order {
  const items = Array.isArray(row.order_items) ? (row.order_items as Row[]) : [];
  return {
    id: str(row.id),
    orderNumber: str(row.order_number),
    customerName: str(row.customer_name),
    whatsapp: str(row.whatsapp),
    items: items.map(orderItemFromRow),
    deliveryMethod: row.delivery_method === "delivery" ? "delivery" : "pickup",
    address: row.address ? str(row.address) : undefined,
    notes: row.notes ? str(row.notes) : undefined,
    status: str(row.status, "menunggu") as OrderStatus,
    total: num(row.total),
    createdAt: str(row.created_at),
    poPeriodId: row.po_period_id ? str(row.po_period_id) : null,
  };
}

export function transactionFromRow(row: Row): CashTransaction {
  return {
    id: str(row.id),
    type: row.type === "income" ? "income" : "expense",
    category: str(row.category),
    description: str(row.description),
    amount: num(row.amount),
    date: str(row.date).slice(0, 10),
    createdAt: str(row.created_at),
  };
}

export function transactionToRow(tx: Partial<CashTransaction>): Row {
  return pick([
    ["id", tx.id],
    ["type", tx.type],
    ["category", tx.category],
    ["description", tx.description],
    ["amount", tx.amount],
    ["date", tx.date],
  ]);
}

export function settingsFromRow(row: Row): StoreSettings {
  return {
    id: "store",
    ownerName: str(row.owner_name),
    email: str(row.email),
    storeName: str(row.store_name, "GAICREAM"),
    whatsapp: str(row.whatsapp),
    address: str(row.address),
    instagram: str(row.instagram),
    tiktok: str(row.tiktok),
  };
}

export function settingsToRow(settings: Partial<StoreSettings>): Row {
  return pick([
    ["id", settings.id],
    ["owner_name", settings.ownerName],
    ["email", settings.email],
    ["store_name", settings.storeName],
    ["whatsapp", settings.whatsapp],
    ["address", settings.address],
    ["instagram", settings.instagram],
    ["tiktok", settings.tiktok],
  ]);
}

export function poFromRow(row: Row): PoPeriod {
  return {
    id: str(row.id),
    name: str(row.name),
    status: row.status === "open" ? "open" : "closed",
    readyDate: row.ready_date ? str(row.ready_date).slice(0, 10) : null,
    quota: row.quota === null || row.quota === undefined ? null : num(row.quota),
    note: str(row.note),
    openedAt: str(row.opened_at),
    closedAt: row.closed_at ? str(row.closed_at) : null,
  };
}
