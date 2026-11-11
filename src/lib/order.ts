import type { Product } from "@/types/product";
import { formatIDR } from "@/lib/utils";

export type DeliveryMethod = "pickup" | "delivery";

export const deliveryLabels: Record<DeliveryMethod, string> = {
  pickup: "Ambil di lokasi",
  delivery: "Delivery",
};

export type OrderLine = {
  product: Product;
  quantity: number;
};

export function orderTotals(lines: OrderLine[]) {
  return lines.reduce(
    (sum, line) => ({
      quantity: sum.quantity + line.quantity,
      price: sum.price + line.product.price * line.quantity,
    }),
    { quantity: 0, price: 0 },
  );
}

export function buildOrderWhatsappMessage(order: {
  orderNumber: string;
  customerName: string;
  lines: OrderLine[];
  deliveryMethod: DeliveryMethod;
  address?: string;
  notes?: string;
}) {
  const total = orderTotals(order.lines).price;
  const rows = [
    "Halo GAICREAM, saya sudah membuat pesanan.",
    "",
    `No. pesanan: ${order.orderNumber}`,
    `Nama: ${order.customerName}`,
    "Pesanan:",
    ...order.lines.map(
      (line) =>
        `- ${line.product.name} × ${line.quantity} = ${formatIDR(line.product.price * line.quantity)}`,
    ),
    `Total: ${formatIDR(total)}`,
    `Penerimaan: ${deliveryLabels[order.deliveryMethod]}`,
  ];
  if (order.deliveryMethod === "delivery" && order.address) {
    rows.push(`Alamat: ${order.address}`);
  }
  if (order.notes) rows.push(`Catatan: ${order.notes}`);
  return rows.join("\n");
}
